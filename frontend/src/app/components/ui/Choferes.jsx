import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/app/components/ui/Shadcn/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/Shadcn/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/Shadcn/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/Shadcn/select";
import { Input } from "@/app/components/ui/Shadcn/input";
import { Button } from "@/app/components/ui/Shadcn/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/Shadcn/popover"
import { agregarDisponibilidadChoferes, cn, fetcher } from "@/app/components/lib/utils"
import { Calendar as CalendarIcon, Loader2 } from "lucide-react"
import { Calendar } from "@/app/components/ui/Shadcn/calendar"
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import Image from 'next/image';
import Pagination from "./Pagination";
import TableGral from "./TableGral";
import DialogGral from "./DialogGral";
import CustomFilter from "./CustomFilter";

const limit = 10;

const formSchema = z.object({
    nombre: z.string().min(1, { message: 'El nombre es requerido' }).max(45, { message: 'El nombre no puede tener más de 45 caracteres' }),
    apellido: z.string().min(1, { message: 'El apellido es requerido' }).max(45, { message: 'El apellido no puede tener más de 45 caracteres' }),
    dni: z.string().min(1, { message: 'El DNI es requerido' }).max(9, { message: 'El DNI no puede tener más de 9 caracteres' }),
    tipoLicencia: z.string().min(1, { message: 'El tipo de licencia es requerido' }).max(45, { message: 'El tipo de licencia no puede tener más de 45 caracteres' }),
    fechaEmision: z.date({ message: 'La fecha de emisión es requerida' })
});

const Choferes = ({ dataPrecioPorKm }) => {
    const [ choferes, setChoferes ] = useState([]);
    const [ pageIndex, setPageIndex ] = useState(1);
    const [ totalPagesState, setTotalPagesState ] = useState(1);
    const [ isDialogOpen, setIsDialogOpen ] = useState(false);
    const [ dialogDeleteOpen, setDialogDeleteOpen ] = useState({ state: false, idChofer: null });
    const [ dialogRenewOpen, setDialogRenewOpen ] = useState({ state: false, idChofer: null });
    const [ saveWorkerIsLoading, setSaveWorkerIsLoading ] = useState(false);
    const [ filtering, setFiltering ] = useState('');

    const table = useReactTable({
        data: choferes,
        columns: [
            { accessorKey: 'nombre', header: 'Nombre' },
            { accessorKey: 'apellido', header: 'Apellido' },
            { accessorKey: 'dni', header: 'DNI' },
            { accessorKey: 'kmViajados', header: 'Kilómetros recorridos', accessorFn: row => `${parseInt(row.kilometrosRecorridos)}` },
            { accessorKey: 'precioTotal', header: 'Precio total', accessorFn: row => `$${dataPrecioPorKm.precio_por_km*parseInt(row.kilometrosRecorridos)}` },
            { accessorKey: 'tipo', header: 'Tipo de Licencia', accessorFn: row => row.tipo === 'profesionales' ? 'Profesional' : 'Particular' },
            { accessorKey: 'fechaEmision', header: 'Fecha de emisión', accessorFn: row => format(new Date(row.fechaEmision), "PPP", { locale: es }) },
            { accessorKey: 'disponible', header: 'Disponible', cell: ({ row }) => row.original.disponible ? <Image src='./check.svg' width={30} height={30} alt='Img check' /> : <Image src='./cross.svg' width={30} height={30} alt='Img check' /> },
            { accessorKey: 'acciones', header: 'Acciones', cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger><Image src='./config.svg' width={30} height={30} alt='Img config' /></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className='cursor-pointer' onClick={() => setDialogRenewOpen({ state: true, idChofer: row.original.id })}>Renovar licencia</DropdownMenuItem>
                            <DropdownMenuItem className='cursor-pointer' onClick={() => setDialogDeleteOpen({ state: true, idChofer: row.original.id })}>Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }}
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
                const response = await fetcher(`choferes?idPrecioPorKm=${dataPrecioPorKm.id}&page=${pageIndex}&limit=${limit}`);
                if (response.statusCode === 200) {
                    const { data, totalPages } = response.payload;
                    const choferes = agregarDisponibilidadChoferes(data);
                    setChoferes(choferes);
                    setTotalPagesState(totalPages);
                } else {
                    toast('Error interno. Por favor intente de nuevo más tarde');
                }
            } catch (error) {
                toast('Error interno. Por favor intente de nuevo más tarde');
            }
        };
        fetchDatos();
    }, [pageIndex, dataPrecioPorKm]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombre: "",
            apellido: '',
            dni: "",
            tipoLicencia: ''
        },
    });

    const guardar = async values => {
        setSaveWorkerIsLoading(true);
        try {
            const response = await fetcher('choferes', { method: 'POST', body: values });

            if (response.statusCode === 200) {
                toast('Chofer registrado correctamente');
                const { newId, totalPages } = response.payload;

                setTotalPagesState(totalPages);

                const aniosAgregados = values.tipoLicencia === 'profesionales' ? 1 : 5;
                const dateEmision = new Date(values.fechaEmision);
                setChoferes([...choferes, { id: newId, ...values, kilometrosRecorridos: 0, disponible: dateEmision.setFullYear(dateEmision.getFullYear()+aniosAgregados) > new Date() }]);

                form.reset();
            } else if (response.statusCode !== 500) {
                toast(response.error);
            } else {
                toast('Error interno. Por favor intente de nuevo más tarde');
            }
        } catch (error) {
            toast('Error interno. Por favor intente de nuevo más tarde');
        }
        setSaveWorkerIsLoading(false);
        setIsDialogOpen(false);
        setPageIndex(1);
    };

    const renovar = async () => {
        try {
            const { idChofer } = dialogRenewOpen;

            const response = await fetcher(`choferes/renewLicence/${idChofer}`, { method: 'PUT' });

            if (response.statusCode === 200) {
                toast('Licencia renovada correctamente');
                setChoferes(choferes.map((chofer) => {
                    if (chofer.id === idChofer) {
                        return { ...chofer, fechaEmision: new Date().toISOString(), disponible: true };
                    }
                    return chofer;
                }));
            } else {
                toast('Error interno. Por favor intente de nuevo más tarde');
            }

            setDialogRenewOpen({ state: false, idChofer: null });
        } catch (error) {
            toast('Error interno. Por favor intente de nuevo más tarde');
        }
    }

    const eliminar = async () => {
        try {
            const { idChofer } = dialogDeleteOpen;

            const response = await fetcher(`choferes/${idChofer}?limit=${limit}`, { method: 'DELETE' });

            if (response.statusCode === 200) {
                const newChoferes = choferes.filter((chofer) => chofer.id !== idChofer);

                if (newChoferes.length === 0 && pageIndex > 1) {
                    setPageIndex(index => index - 1);
                } else {
                    setChoferes(newChoferes);
                }
            } else if (response.statusCode !== 500) {
                toast(response.error);
            } else {
                toast('Error interno. Por favor intente de nuevo más tarde');
            }

            setDialogDeleteOpen({ state: false, idChofer: null });
        } catch (error) {
            toast('Error interno. Por favor intente de nuevo más tarde');
        }
    };

    return (
        <>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger className='my-5 h-10 w-48 bg-blue-800 text-white rounded md:hover:bg-blue-600 md:active:bg-blue-950 max-md:active:bg-blue-600'>Agregar nuevo chofer</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Registrar nuevo chofer</DialogTitle>
                    <DialogDescription>
                        Completa los campos para registrar un nuevo chofer
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(guardar)} className="grid gap-4 border-4 border-black p-2 rounded">
                        <FormField control={form.control} name="nombre" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                    <Input placeholder="Juan" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="apellido" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Apellido</FormLabel>
                                <FormControl>
                                    <Input placeholder="Pérez" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="dni" render={({ field }) => (
                            <FormItem>
                                <FormLabel>DNI (sin puntos)</FormLabel>
                                <FormControl>
                                    <Input placeholder="40123123" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="tipoLicencia" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de Licencia</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona una marca" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='particulares'>Particular</SelectItem>
                                        <SelectItem value='profesionales'>Profesional</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="fechaEmision" render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Fecha de emisión de la licencia</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground" )}> { field.value ? format(field.value, "PPP", { locale: es }) : <span>Selecciona una fecha</span> }
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0" align="start">
                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01") } initialFocus/>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                        <Button className='col-span-full' type="submit" disabled={saveWorkerIsLoading}>
                            {saveWorkerIsLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</> : "Guardar"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

        <CustomFilter filtering={filtering} setFiltering={setFiltering} />

        <TableGral table={table} msgEmpty="No hay choferes" />

        <Pagination className="my-2 flex justify-center text-sm" pageIndex={pageIndex} setPageIndex={setPageIndex} totalPagesState={totalPagesState} />

        <p className='mb-10'>En la columna "Kilómetros recorridos" y "Precio total" se están considerando únicamente los viajes realizados con el precio por kilómetro actual</p>

        <DialogGral dialogOpen={dialogRenewOpen} setDialogOpen={setDialogRenewOpen} title="¿Renovar licencia?" description="Esta acción hará que la fecha de emisión de la licencia sea la actual" btnText="Renovar" btnAction={renovar} />

        <DialogGral dialogOpen={dialogDeleteOpen} setDialogOpen={setDialogDeleteOpen} title="¿Eliminar chofer?" description="Esta acción eliminará del registro al chofer" btnText="Eliminar" btnAction={eliminar} />
        </>
    );
};

export default Choferes;
