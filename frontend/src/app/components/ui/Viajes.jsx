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
    kms: z.string().transform(val => Number(val)).refine((val) => Number.isInteger(val) && val > 0, {
        message: 'Los kilómetros deben ser un número natural',
    }),
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
                const resChoferes = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/choferes?idPrecioPorKm=${dataPrecioPorKm.id}&ignoreLimit=true`).then((res) => res.json());
                const choferes = agregarDisponibilidadChoferes(resChoferes.payload.data);
                setChoferes(choferes);
                console.log('Choferes:', choferes);

                const resVehiculos = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/vehiculos?ignoreLimit=true`).then((res) => res.json());
                const vehiculos = agregarDisponibilidadVehiculos(resVehiculos.payload.data);
                setVehiculos(vehiculos);
                console.log('Vehículos:', vehiculos);

                const { payload } = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/viajes?page=${pageIndex}&limit=${limit}`).then((res) => res.json());
                const { data, totalPages } = payload;
                const viajes = completarDatosViajes(data, choferes, vehiculos);
                console.log('Viajes:', viajes);
                console.log('Total pages:', totalPages);

                setViajes(viajes);
                setTotalPagesState(totalPages);
                toast("Viajes")
            } catch (error) {
                console.log('Error:', error);
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
        console.log('Form:', values);

        try {
            const { kms, chofer_id, vehiculo_id } = values;
            const { payload } = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/viajes?limit=${limit}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ kms, chofer_id: parseInt(chofer_id), vehiculo_id: parseInt(vehiculo_id), precio_por_km_id: dataPrecioPorKm.id }),
            }).then((res) => res.json());

            const { newId, totalPages, fecha, horas, minutos } = payload;

            setTotalPagesState(totalPages);

            const chofer = choferes.find(c => c.id == chofer_id);
            const vehiculo = vehiculos.find(v => v.id == vehiculo_id);
            const newViajes = [...viajes, { ...values, id: newId, chofer, vehiculo, fecha, horas, minutos }];

            setViajes(newViajes);

            form.reset();
            setIsDialogOpen(false);
            setPageIndex(1);
        } catch (error) {
            console.log('Error:', error);
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
                                <Controller control={form.control} name="chofer_id" render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona una chofer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                loading || choferes.map(chofer => (
                                                    <SelectItem disabled={!chofer.disponible} key={chofer.id} value={`${chofer.id}`}>{chofer.nombre}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                )} />
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="vehiculo_id" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vehículo</FormLabel>
                                <Controller control={form.control} name="vehiculo_id" render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un vehículo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                loading || vehiculos.map(v => (
                                                    <SelectItem disabled={!v.disponible} key={v.id} value={`${v.id}`}>{`${v.marca} ${v.modelo} - ${v.dominio}`}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                )} />
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
        <Input
            placeholder="Filtar por nombre"
            value={(table.getColumn("choferNombre")?.getFilterValue()) ?? ""}
            onChange={(event) =>
                table.getColumn("choferNombre")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
        />
        </div>

        <Table>
            <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                    return (
                    <TableHead key={header.id}>
                        {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                            )}
                    </TableHead>
                    )
                })}
                </TableRow>
            ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                    <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                    >
                        {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                        ))}
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={ table.getAllColumns() } className="h-24 text-center">
                        No hay choferes
                    </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
        </>
    );
};

export default Viajes;

/*
Cada columna tiene:
- Fecha
- Horas
- Minutos
- Kilómetros
- Nombre chofer
- Apellido chofer
- Patente auto
- Marca auto
- Modelo auto
*/
