import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/app/components/ui/Shadcn/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/Shadcn/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/Shadcn/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/Shadcn/select";
import { Input } from "@/app/components/ui/Shadcn/input";
import { Button } from "@/app/components/ui/Shadcn/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/Shadcn/popover"
import { agregarDisponibilidadChoferes, cn } from "@/app/components/lib/utils"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/app/components/ui/Shadcn/calendar"
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/Shadcn/table"
import Image from 'next/image';

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
    const [ loading, setLoading ] = useState(true);
    const [ columnFilters, setColumnFilters ] = useState([]);
    const [ pageIndex, setPageIndex ] = useState(1);
    const [ totalPagesState, setTotalPagesState ] = useState(1);
    const [ isDialogOpen, setIsDialogOpen ] = useState(false);
    const [ dialogDeleteOpen, setDialogDeleteOpen ] = useState({ state: false, idChofer: null });
    const [ dialogRenewOpen, setDialogRenewOpen ] = useState({ state: false, idChofer: null });

    const table = useReactTable({
        data: choferes,
        columns: [ { accessorKey: 'nombre', header: 'Nombre' }, { accessorKey: 'apellido', header: 'Apellido' }, { accessorKey: 'dni', header: 'DNI' }, { accessorKey: 'kmViajados', header: 'Kilómetros recorridos', cell: ({ row }) => {
            return parseInt(row.original.kilometrosRecorridos);
        } }, { accessorKey: 'precioTotal', header: 'Precio total', cell : ({ row }) => {
            return `$${dataPrecioPorKm.precio_por_km*parseInt(row.original.kilometrosRecorridos)}`;
        } }, { accessorKey: 'tipo', header: 'Tipo de Licencia', cell: ({ row }) => {
            return row.original.tipo === 'profesionales' ? 'Profesional' : 'Particular';
        } }, { accessorKey: 'fechaEmision', header: 'Fecha de emisión', cell: ({ row }) => {
            return format(new Date(row.original.fechaEmision), "PPP", { locale: es });
        } }, { accessorKey: 'disponible', header: 'Disponible', cell: ({ row }) => {
            return row.original.disponible ? <Image src='./check.svg' width={30} height={30} alt='Img check' /> : <Image src='./cross.svg' width={30} height={30} alt='Img check' /> ;
        } }, { accessorKey: 'acciones', header: 'Acciones', cell: ({ row }) => {
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
                const { payload } = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/choferes?idPrecioPorKm=${dataPrecioPorKm.id}&page=${pageIndex}&limit=${limit}`).then((res) => res.json());
                const { data, totalPages } = payload;
                const choferes = agregarDisponibilidadChoferes(data);
                console.log('Choferes:', choferes);
                console.log('Total pages:', totalPages);

                setChoferes(choferes);
                setTotalPagesState(totalPages);
                toast("Choferes")
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
            nombre: "",
            apellido: '',
            dni: "",
            tipoLicencia: ''
        },
    });

    const guardar = async values => {
        console.log('Form:', values);

        try {
            const { payload } = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/choferes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            }).then((res) => res.json());

            const { newId, totalPages } = payload;

            setTotalPagesState(totalPages);

            const aniosAgregados = values.tipoLicencia === 'profesionales' ? 1 : 5;
            const dateEmision = new Date(values.fechaEmision);
            setChoferes([...choferes, { id: newId, ...values, kilometrosRecorridos: 0, disponible: dateEmision.setFullYear(dateEmision.getFullYear()+aniosAgregados) > new Date() }]);

            form.reset();
            setIsDialogOpen(false);
            setPageIndex(1);
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const renovar = async () => {
        try {
            const { idChofer } = dialogRenewOpen;

            await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/choferes/renewLicence/${idChofer}`, {
                method: 'PUT',
            });

            setChoferes(choferes.map((chofer) => {
                if (chofer.id === idChofer) {
                    return { ...chofer, fechaEmision: new Date().toISOString() };
                }
                return chofer;
            }));

            setDialogRenewOpen({ state: false, idChofer: null });
        } catch (error) {
            console.log('Error:', error);
        }
    }

    const eliminar = async () => {
        try {
            const { idChofer } = dialogDeleteOpen;

            const { payload } = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/choferes/${idChofer}?limit=${limit}`, {
                method: 'DELETE',
            }).then((res) => res.json());

            console.log('Total pages:', payload);

            const newChoferes = choferes.filter((chofer) => chofer.id !== idChofer);

            if (newChoferes.length === 0 && pageIndex > 1) {
                setPageIndex(index => index - 1);
            } else {
                setChoferes(newChoferes);
            }
            setDialogDeleteOpen({ state: false, idChofer: null });
        } catch (error) {
            console.log('Error:', error);
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
                                    <Controller control={form.control} name="tipoLicencia" render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona una marca" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='particulares'>Particular</SelectItem>
                                                <SelectItem value='profesionales'>Profesional</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )} />
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

                            <Button className='col-span-full' type="submit">Guardar</Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <div className="flex items-center py-4">
                <Input
                    placeholder="Filtar por nombre"
                    value={(table.getColumn("nombre")?.getFilterValue()) ?? ""}
                    onChange={(event) =>
                        table.getColumn("nombre")?.setFilterValue(event.target.value)
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

        <p>En la columna "Kilómetros recorridos" y "Precio total" se están considerando únicamente los viajes con el precio por kilómetro actual</p>

        <Dialog open={dialogRenewOpen.state} onOpenChange={setDialogRenewOpen}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>¿Renovar licencia?</DialogTitle>
                <DialogDescription>
                    Esta acción hará que la fecha de emisión de la licencia sea la actual
                </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={ renovar }>Renovar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Dialog open={dialogDeleteOpen.state} onOpenChange={setDialogDeleteOpen}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>¿Eliminar chofer?</DialogTitle>
                <DialogDescription>
                    Esta acción eliminará del registro al chofer
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

export default Choferes;
