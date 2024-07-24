import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/app/components/ui/Shadcn/button";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/Shadcn/form";
import { Input } from "@/app/components/ui/Shadcn/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/Shadcn/select";
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/app/components/ui/Shadcn/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/Shadcn/dialog";
import { toast } from "sonner";
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { agregarDisponibilidadVehiculos, fetcher } from "../lib/utils";
import Pagination from "./Pagination";
import TableGral from "./TableGral";
import DialogGral from "./DialogGral";

const limit = 10;

const formSchema = z.object({
    dominio: z.string().min(1, { message: 'La patente es requerida' }).max(20, { message: 'La patente no debe superar los 20 caracteres' }),
    modelo: z.string().min(1, { message: 'El modelo es requerido' }).max(50, { message: 'El modelo no debe superar los 50 caracteres' }),
    kmParciales: z.string().transform(val => Number(val)).refine(val => Number.isInteger(val) && val >= 0 && val < 1000000, { message: 'El kilometraje debe ser un número entero menor a 1000000' }),
    marca: z.string().min(1, { message: 'La marca es requerida' }).max(50, { message: 'La marca no debe superar los 50 caracteres' })
});

const Vehiculos = () => {
    const [ vehiculos, setVehiculos ] = useState([]);
    const [ marcas, setMarcas ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ isDialogOpen, setIsDialogOpen ] = useState(false);
    const [ dialogDeleteOpen, setDialogDeleteOpen ] = useState({ state: false, idVehicle: null });
    const [ dialogRestoreOpen, setDialogRestoreOpen ] = useState({ state: false, idVehicle: null });
    const [ columnFilters, setColumnFilters ] = useState([]);
    const [ pageIndex, setPageIndex ] = useState(1);
    const [ totalPagesState, setTotalPagesState ] = useState(1);
    const [ saveCarIsLoading, setSaveCarIsLoading ] = useState(false);

    const table = useReactTable({
        data: vehiculos,
        columns: [
            { accessorKey: 'dominio', header: 'Patente' },
            { accessorKey: 'marca', header: 'Marca' },
            { accessorKey: 'modelo', header: 'Modelo' },
            { accessorKey: 'kmParciales', header: 'Kilometraje' },
            { accessorKey: 'kmTotales', header: 'Kilometraje total' },
            { accessorKey: 'disponible', header: 'Disponible', cell: ( { row }) => row.original.disponible ? <Image src='./check.svg' width={30} height={30} alt='Img check' /> : <Image src='./cross.svg' width={30} height={30} alt='Img check' /> },
            { accessorKey: 'acciones', header: 'Acciones', cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger><Image src='./config.svg' width={30} height={30} alt='Img config' /></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className='cursor-pointer' onClick={() => setDialogRestoreOpen({ state: true, idVehicle: row.original.id })}>Reparar</DropdownMenuItem>
                            <DropdownMenuItem className='cursor-pointer' onClick={() => setDialogDeleteOpen({ state: true, idVehicle: row.original.id })}>Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }}
        ],
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
          columnFilters,
        },
    })

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const responseVehiculos = await fetcher(`vehiculos?page=${pageIndex}&limit=${limit}`);
                if (responseVehiculos.statusCode === 200) {
                    const { data, totalPages } = responseVehiculos.payload;
                    const resVehiculos = agregarDisponibilidadVehiculos(data);

                    const responseMarcas = await fetcher('marcas');
                    if (responseMarcas.statusCode === 200) {
                        setMarcas(responseMarcas.payload);
                    } else {
                        toast("Error interio. Por favor intente de nuevo más tarde")
                    }

                    if (resVehiculos.length === 0 && pageIndex > 1) {
                        setPageIndex(1);
                        toast(`La página ${pageIndex} ya no existe. Lo redirigimos a la página 1`);
                    } else {
                        setVehiculos(resVehiculos);
                        setTotalPagesState(totalPages);
                    }
                } else if (responseVehiculos.statusCode !== 500) {
                    toast(responseVehiculos.error);
                } else {
                    toast("Error interio. Por favor intente de nuevo más tarde")
                }
                setLoading(false);
            } catch (error) {
                toast("Error interio. Por favor intente de nuevo más tarde")
            }
        };
        fetchDatos();
    }, [pageIndex]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dominio: "",
            modelo: '',
            kmParciales: "0",
            marca: ''
        },
    });

    const guardar = async values => {
        setSaveCarIsLoading(true);
        try {
            const response = await fetcher(`vehiculos?limit=${limit}`, { method: 'POST', body: values });

            if (response.statusCode === 200) {
                const { payload } = response;
                const { newId, totalPages } = payload;

                toast("Vehículo registrado correctamente");
                setTotalPagesState(totalPages);
                setVehiculos([...vehiculos, { ...values, kmTotales: 0, id: newId, disponible: parseInt(values.kmParciales) < 15000 }]);
                form.reset();
            } else if (response.statusCode !== 500) {
                toast(response.error);
            } else {
                toast("Error interno. Por favor intente de nuevo más tarde");
            }

        } catch (error) {
            toast("Error interno. Por favor intente de nuevo más tarde");
        }
        setSaveCarIsLoading(false);
        setIsDialogOpen(false);
        setPageIndex(1);
    };

    const reparar = async () => {
        try {
            const { idVehicle } = dialogRestoreOpen;

            const response = await fetcher(`vehiculos/resetKm/${idVehicle}`, { method: 'PUT' });

            if (response.statusCode === 200) {
                toast("Vehículo reparado correctamente");
                setVehiculos(vehiculos.map(v => {
                    if (v.id === idVehicle) {
                        return { ...v, kmTotales: v.kmTotales + v.kmParciales, kmParciales: 0, disponible: true };
                    }
                    return v;
                }));
            } else {
                toast("Error interno. Por favor intente de nuevo más tarde");
            }

        } catch (error) {
            toast("Error interno. Por favor intente de nuevo más tarde");
        }
        setDialogRestoreOpen({ state: false, idVehicle: null });
    };

    const eliminar = async () => {
        try {
            const { idVehicle } = dialogDeleteOpen;

            const response = await fetcher(`vehiculos/${idVehicle}?limit=${limit}`, { method: 'DELETE' });

            if (response.statusCode === 200) {
                const nuevoVehiculos = vehiculos.filter(v => v.id !== idVehicle);
                toast("Vehículo eliminado correctamente");
                if (nuevoVehiculos.length === 0 && pageIndex > 1) {
                    setPageIndex(index => index - 1);
                } else {
                    setVehiculos(nuevoVehiculos);
                }
            } else if (response.statusCode !== 500) {
                toast(response.error);
            }else {
                toast("Error interno. Por favor intente de nuevo más tarde");
            }

            setDialogDeleteOpen({ state: false, idVehicle: null });
        } catch (error) {
            toast("Error interno. Por favor intente de nuevo más tarde");
        }
    };

    return (
        <>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger className='my-5 h-10 w-48 bg-blue-800 text-white rounded md:hover:bg-blue-600 md:active:bg-blue-950 max-md:active:bg-blue-600'>Agregar nuevo vehículo</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Agregar nuevo vehículo</DialogTitle>
                    <DialogDescription>
                        Completa los campos para agregar un nuevo vehículo
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(guardar)} className="grid grid-cols-2 gap-4 border-4 border-black p-2 rounded">
                        <FormField control={form.control} name="dominio" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Patente</FormLabel>
                                <FormControl>
                                    <Input placeholder="AYN 135" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="marca" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Marca</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona una marca" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loading || marcas.map(marca => (
                                            <SelectItem key={marca.id} value={marca.nombre}>{marca.nombre}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="modelo" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Modelo</FormLabel>
                                <FormControl>
                                    <Input placeholder="Corolla" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="kmParciales" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Kilometraje</FormLabel>
                                <FormControl>
                                    <Input placeholder="0" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <Button className='col-span-full' type="submit" disabled={saveCarIsLoading}>
                            {saveCarIsLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</> : "Guardar"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

        <div className="flex items-center py-4">
            <Input placeholder="Filtar por marca" value={table.getColumn("marca")?.getFilterValue() ?? ""} onChange={event => table.getColumn("marca")?.setFilterValue(event.target.value)} className="max-w-sm" />
        </div>

        <TableGral table={table} msgEmpty="No hay vehículos" />

        <Pagination className="mt-2 mb-10 flex justify-center text-sm" pageIndex={pageIndex} setPageIndex={setPageIndex} totalPagesState={totalPagesState} />

        <DialogGral dialogOpen={dialogRestoreOpen} setDialogOpen={setDialogRestoreOpen} title="¿Reparar vehículo?" description="Esta acción reseteará el kilometraje y se sumará al total" btnText="Reparar" btnAction={reparar} />

        <DialogGral dialogOpen={dialogDeleteOpen} setDialogOpen={setDialogDeleteOpen} title="¿Eliminar vehículo?" description="Esta acción eliminará del registro al vehículo" btnText="Eliminar" btnAction={eliminar} />
        </>
    );
};

export default Vehiculos;
