import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/Shadcn/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/Shadcn/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/Shadcn/select";
import { Input } from "@/app/components/ui/Shadcn/input";
import { Button } from "@/app/components/ui/Shadcn/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { agregarDisponibilidadChoferes, agregarDisponibilidadVehiculos, completarDatosViajes } from "../lib/utils";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/Shadcn/table"
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
    const [ columnFilters, setColumnFilters ] = useState([]);
    const [ pageIndex, setPageIndex ] = useState(1);
    const [ totalPagesState, setTotalPagesState ] = useState(1);
    const [ isDialogOpen, setIsDialogOpen ] = useState(false);

    const table = useReactTable({
        data: viajes,
        columns: [
            { accessorKey: 'fecha', header: 'Fecha', cell: ({ row }) => format(new Date(row.original.fecha), "PPP", { locale: es }) },
            { accessorKey: 'horas', header: 'Hora' },
            { accessorKey: 'minutos', header: 'Minutos' },
            { accessorKey: 'kms', header: 'Kilómetros', cell: ({ row }) => parseInt(row.original.kms) },
            { id: 'choferNombre', accessorKey: 'chofer.nombre', header: 'Nombre' },
            { accessorKey: 'chofer.apellido', header: 'Apellido' },
            { accessorKey: 'vehiculo.dominio', header: 'Patente' },
            { accessorKey: 'vehiculo.marca', header: 'Marca auto' },
            { accessorKey: 'vehiculo.modelo', header: 'Modelo auto' }
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
                const [ resChoferes, resVehiculos, resViajes ] = await Promise.allSettled([
                    fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/choferes?idPrecioPorKm=${dataPrecioPorKm.id}&ignoreLimit=true`).then(res => res.json()),
                    fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/vehiculos?ignoreLimit=true`).then(res => res.json()),
                    fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/viajes?page=${pageIndex}&limit=${limit}`).then(res => res.json())
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
        try {
            const { kms, chofer_id, vehiculo_id } = values;
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/viajes?limit=${limit}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ kms, chofer_id: parseInt(chofer_id), vehiculo_id: parseInt(vehiculo_id), precio_por_km_id: dataPrecioPorKm.id }),
            }).then(res => res.json());

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
            setIsDialogOpen(false);
            setPageIndex(1);

        } catch (error) {
            toast("Error interno. Por favor intente de nuevo más tarde");
        }
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

                        <Button className='col-span-full' type="submit">Guardar</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

        <div className="flex items-center py-4">
            <Input placeholder="Filtar por nombre" value={table.getColumn("choferNombre")?.getFilterValue() ?? ""} onChange={event => table.getColumn("choferNombre")?.setFilterValue(event.target.value)} className="max-w-sm" />
        </div>

        <Table>
            <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                    return (
                    <TableHead key={header.id} className='font-bold text-black text-sm max-md:text-xs'>
                        {
                        header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())
                        }
                    </TableHead>
                    )
                })}
                </TableRow>
            ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className='max-md:text-xs'>
                        {row.getVisibleCells().map(cell => (
                            <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={ table.getAllColumns() } className="h-24 text-center">
                            No hay viajes
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>

        <div className="my-2 flex justify-center text-sm">
            <button onClick={ () => setPageIndex(index => index-1) } disabled={pageIndex === 1} className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Anterior</button>
            {
            pageIndex !== 1 && <button onClick={ () => setPageIndex(1) } className="flex items-center justify-center px-3 h-8 border border-gray-300 bg-white hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">1</button>
            }
            <button className="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">{ pageIndex }</button>
            {
            pageIndex !== totalPagesState && totalPagesState !== 0 && <button onClick={ () => setPageIndex(totalPagesState) } className="lex items-center justify-center px-3 h-8 border border-gray-300 bg-white hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">{ totalPagesState }</button>
            }
            <button onClick={ () => setPageIndex(index => index+1) } disabled={pageIndex === totalPagesState || totalPagesState == 0} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Siguiente</button>
        </div>
        </>
    );
};

export default Viajes;
