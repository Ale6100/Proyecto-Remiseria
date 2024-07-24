import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/Shadcn/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/Shadcn/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/Shadcn/select";
import { Input } from "@/app/components/ui/Shadcn/input";
import { Button } from "@/app/components/ui/Shadcn/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { agregarDisponibilidadChoferes, agregarDisponibilidadVehiculos, completarDatosViajes, fetcher } from "../lib/utils";
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import Pagination from "./Pagination";
import TableGral from "./TableGral";
import CustomFilter from "./CustomFilter";

const limit = 10;

const formSchema = z.object({
    kms: z.string().transform(val => Number(val)).refine(val => Number.isInteger(val) && val > 0 && val < 1000000, { message: 'Los kilómetros deben ser un número natural menor a 1000000' }),
    vehiculo_id: z.string({ message: 'El vehículo es requerido' }),
    chofer_id: z.string({ message: 'El chofer es requerido' }),
});

const Viajes = ({ dataPrecioPorKm }) => {
    const [ viajes, setViajes ] = useState([]);
    const [ choferes, setChoferes ] = useState([]);
    const [ vehiculos, setVehiculos ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ pageIndex, setPageIndex ] = useState(1);
    const [ totalPagesState, setTotalPagesState ] = useState(1);
    const [ isDialogOpen, setIsDialogOpen ] = useState(false);
    const [ saveTravelIsLoading, setSaveTravelIsLoading ] = useState(false);
    const [ filtering, setFiltering ] = useState('');

    const table = useReactTable({
        data: viajes,
        columns: [
            { accessorKey: 'fecha', header: 'Fecha', accessorFn: row => format(new Date(row.fecha), "PPP", { locale: es }) },
            { accessorKey: 'horas', header: 'Hora' },
            { accessorKey: 'minutos', header: 'Minutos' },
            { accessorKey: 'kms', header: 'Kilómetros', accessorFn: row => `${parseInt(row.kms)}` },
            { id: 'choferNombre', accessorKey: 'chofer.nombre', header: 'Nombre' },
            { accessorKey: 'chofer.apellido', header: 'Apellido' },
            { accessorKey: 'vehiculo.marca', header: 'Marca auto' },
            { accessorKey: 'vehiculo.modelo', header: 'Modelo auto' },
            { accessorKey: 'vehiculo.dominio', header: 'Patente' }
        ],
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter: filtering,
        },
        onGlobalFilterChange: setFiltering,
    })

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const [ resChoferes, resVehiculos, resViajes ] = await Promise.allSettled([
                    fetcher(`choferes?idPrecioPorKm=${dataPrecioPorKm.id}&ignoreLimit=true`),
                    fetcher(`vehiculos?ignoreLimit=true`),
                    fetcher(`viajes?page=${pageIndex}&limit=${limit}`)
                ]);

                let error = false;
                if (resChoferes.status === "fulfilled") {
                    if (resChoferes.value.statusCode === 200) {
                        const choferes = agregarDisponibilidadChoferes(resChoferes.value.payload.data);
                        setChoferes(choferes);
                    } else error = true;
                } else error = true;

                if (resVehiculos.status === "fulfilled") {
                    if (resVehiculos.value.statusCode === 200) {
                        const vehiculos = agregarDisponibilidadVehiculos(resVehiculos.value.payload.data);
                        setVehiculos(vehiculos);
                    } else error = true;
                } else error = true;

                if (resViajes.status === "fulfilled" && resChoferes.status === "fulfilled" && resVehiculos.status === "fulfilled") {
                    if (resViajes.value.statusCode === 200) {
                        const { data, totalPages } = resViajes.value.payload;
                        const viajes = completarDatosViajes(data, resChoferes.value.payload.data, resVehiculos.value.payload.data);
                        setViajes(viajes);
                        setTotalPagesState(totalPages);
                    } else error = true;
                } else error = true;

                if (error) {
                    toast("Error interno. Por favor intente de nuevo más tarde");
                }

            } catch (error) {
                toast("Error interno. Por favor intente de nuevo más tarde");
            }
            setLoading(false);
        };
        fetchDatos();
    }, [pageIndex, dataPrecioPorKm]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            kms: "0",
            modelo: '',
            marca: ''
        },
    });

    const guardar = async values => {
        setSaveTravelIsLoading(true);
        try {
            const { kms, chofer_id, vehiculo_id } = values;
            const response = await fetcher(`viajes?limit=${limit}`, { method: 'POST', body: { kms, chofer_id: parseInt(chofer_id), vehiculo_id: parseInt(vehiculo_id), precio_por_km_id: dataPrecioPorKm.id } });

            if (response.statusCode === 200) {
                toast("Viaje registrado correctamente");
                const { newId, totalPages, fecha, horas, minutos } = response.payload;

                setTotalPagesState(totalPages);

                const chofer = choferes.find(c => c.id == chofer_id);
                const vehiculo = vehiculos.find(v => v.id == vehiculo_id);
                const newViajes = [...viajes, { ...values, id: newId, chofer, vehiculo, fecha, horas, minutos }];

                setViajes(newViajes);
                form.reset();
            } else if (response.statusCode !== 500) {
                toast(response.error);
            } else {
                toast("Error interno. Por favor intente de nuevo más tarde");
            }
        } catch (error) {
            toast("Error interno. Por favor intente de nuevo más tarde");
        }
        setSaveTravelIsLoading(false);
        setIsDialogOpen(false);
        setPageIndex(1);
    };

    return (
        <>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger className='my-5 h-10 w-48 bg-blue-800 text-white rounded md:hover:bg-blue-600 md:active:bg-blue-950 max-md:active:bg-blue-600'>Registrar nuevo viaje</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear nuevo viaje</DialogTitle>
                    <DialogDescription>
                        Completa los campos para registrar un nuevo viaje
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(guardar)} className="grid grid-cols-1 gap-4 border-4 border-black p-2 rounded">
                        <FormField control={form.control} name="chofer_id" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Chofer</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona una chofer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loading || choferes.map(chofer => (
                                            <SelectItem disabled={!chofer.disponible} key={chofer.id} value={`${chofer.id}`}>{chofer.nombre}</SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="vehiculo_id" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vehículo</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un vehículo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loading || vehiculos.map(v => (
                                            <SelectItem disabled={!v.disponible} key={v.id} value={`${v.id}`}>{`${v.marca} ${v.modelo} - ${v.dominio}`}</SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="kms" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Kilómetros</FormLabel>
                                <FormControl>
                                    <Input placeholder="0" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <Button className='col-span-full' type="submit" disabled={saveTravelIsLoading}>
                            {saveTravelIsLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</> : "Guardar"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

        <CustomFilter filtering={filtering} setFiltering={setFiltering} />

        <TableGral table={table} msgEmpty="No hay viajes" />

        <Pagination className="my-2 flex justify-center text-sm" pageIndex={pageIndex} setPageIndex={setPageIndex} totalPagesState={totalPagesState} />
        </>
    );
};

export default Viajes;
