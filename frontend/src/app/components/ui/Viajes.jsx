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

const limit = 10;

const formSchema = z.object({});

const Viajes = ({ dataPrecioPorKm }) => {
    const [ viajes, setViajes ] = useState([]);
    const [ choferes, setChoferes ] = useState([]);
    const [ vehiculos, setVehiculos ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ pageIndex, setPageIndex ] = useState(1);
    const [ totalPagesState, setTotalPagesState ] = useState(1);
    const [ isDialogOpen, setIsDialogOpen ] = useState(false);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const { payload } = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/viajes?page=${pageIndex}&limit=${limit}`).then((res) => res.json());
                const { data, totalPages } = payload;
                console.log('Viajes:', data);
                console.log('Total pages:', totalPages);

                const resChoferes = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/choferes?ignoreLimit=true`).then((res) => res.json());
                setChoferes(resChoferes.payload.data);
                console.log('Choferes:', resChoferes.payload.data);

                const resVehiculos = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/vehiculos?ignoreLimit=true`).then((res) => res.json());
                setVehiculos(resVehiculos.payload.data);
                console.log('Vehículos:', resVehiculos.payload.data);

                setViajes(data);
                setTotalPagesState(totalPages);
                toast("Viajes")
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

    const guardar = async values => {};

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
