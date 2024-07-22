import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/app/components/ui/Shadcn/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/Shadcn/form";
import { Input } from "@/app/components/ui/Shadcn/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/Shadcn/select";
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/app/components/ui/Shadcn/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/Shadcn/dialog";
import { toast } from "sonner";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/Shadcn/table"

const limit = 10;

const formSchema = z.object({
    dominio: z.string().min(1, {
        message: 'La patente es requerida',
    }).max(20, {
        message: 'La patente no debe superar los 20 caracteres',
    }),
    modelo: z.string().min(1, {
        message: 'El modelo es requerido',
    }).max(50, {
        message: 'El modelo no debe superar los 50 caracteres',
    }),
    kmParciales: z.string().transform(val => Number(val)).refine((val) => Number.isInteger(val) && val >= 0, {
        message: 'El kilometraje debe ser un número natural o cero',
    }),
    marca: z.string().min(1, {
        message: 'La marca es requerida',
    }).max(50, {
        message: 'La marca no debe superar los 50 caracteres',
    }),
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

    const table = useReactTable({
        data: vehiculos,
        columns: [ { accessorKey: 'dominio', header: 'Patente' }, { accessorKey: 'marca', header: 'Marca' }, { accessorKey: 'modelo', header: 'Modelo' }, { accessorKey: 'kmParciales', header: 'Kilometraje' }, { accessorKey: 'kmTotales', header: 'Kilometraje total' }, { accessorKey: '6', header: 'Disponible', cell: ( { row }) => {
            return row.original.kmParciales >= 15000 ? <Image src='./cross.svg' width={30} height={30} alt='Img check' /> : <Image src='./check.svg' width={30} height={30} alt='Img check' />
        } }, { accessorKey: 'acciones', header: 'Acciones', cell: ({ row }) => {
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
        } } ],
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
                const { payload } = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/vehiculos?page=${pageIndex}&limit=${limit}`).then((res) => res.json());
                const { data, totalPages } = payload;
                const marcas = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/marcas`).then((res) => res.json());
                console.log('Vehiculos:', data);
                console.log('Marcas:', marcas);
                if (data.length === 0 && pageIndex > 1) {
                    setPageIndex(1);
                    toast(`La página ${pageIndex} ya no existe. Lo redirigimos a la página 1`);
                } else {
                    setVehiculos(data);
                    setTotalPagesState(totalPages);
                    setMarcas(marcas.payload);
                }
            } catch (error) {
                console.log('Error:', error);
            }
            setLoading(false);
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
        console.log('Form:', values);

        try {
            const { payload } = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/vehiculos?limit=${limit}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            }).then((res) => res.json());

            const { newId, totalPages } = payload;

            setTotalPagesState(totalPages);

            setVehiculos([...vehiculos, { ...values, kmTotales: 0, id: newId }]);
            console.log('nuevos autos', [...vehiculos, { ...values, kmTotales: 0, id: newId }]);

            form.reset();
            setIsDialogOpen(false);
            setPageIndex(1);
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const reparar = async () => {
        try {
            const { idVehicle } = dialogRestoreOpen;

            await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/vehiculos/resetKm/${idVehicle}`, {
                method: 'PUT',
            });

            setVehiculos(vehiculos.map(v => {
                if (v.id === idVehicle) {
                    return { ...v, kmTotales: v.kmTotales + v.kmParciales, kmParciales: 0 };
                }
                return v;
            }));

            setDialogRestoreOpen({ state: false, idVehicle: null });
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const eliminar = async () => {
        try {
            const { idVehicle } = dialogDeleteOpen;

            const { payload } = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/vehiculos/${idVehicle}?limit=${limit}`, {
                method: 'DELETE',
            }).then((res) => res.json());

            console.log('Total pages:', payload);

            const nuevoVehiculos = vehiculos.filter(v => v.id !== idVehicle);

            if (nuevoVehiculos.length === 0 && pageIndex > 1) {
                setPageIndex(index => index - 1);
            } else {
                setVehiculos(nuevoVehiculos);
            }

            setDialogDeleteOpen({ state: false, idVehicle: null });
        } catch (error) {
            console.log('Error:', error);
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
                                    <Controller control={form.control} name="marca" render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona una marca" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    loading || marcas.map((marca) => (
                                                        <SelectItem key={marca.id} value={marca.nombre}>{marca.nombre}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    )} />
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

                            <Button className='col-span-full' type="submit">Guardar</Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
            <div className="flex items-center py-4">
                <Input
                placeholder="Filtar por marca"
                value={(table.getColumn("marca")?.getFilterValue()) ?? ""}
                onChange={(event) =>
                    table.getColumn("marca")?.setFilterValue(event.target.value)
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
                            No hay vehículos
                        </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <div className="inline-flex -space-x-px text-sm">
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

            <Dialog open={dialogRestoreOpen.state} onOpenChange={setDialogRestoreOpen}>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>¿Reparar vehículo?</DialogTitle>
                    <DialogDescription>
                        Esta acción reseteará el kilometraje y se sumará al total
                    </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={ reparar }>Reparar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={dialogDeleteOpen.state} onOpenChange={setDialogDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>¿Eliminar vehículo?</DialogTitle>
                    <DialogDescription>
                        Esta acción eliminará del registro al vehículo
                    </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={ eliminar }>Eliminar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Vehiculos;
