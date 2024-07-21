import { useEffect, useState, Fragment } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod";
import { Button } from "@/app/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import Image from 'next/image';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/app//components/ui/dropdown-menu"

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
})

const Vehiculos = () => {
    const [ vehiculos, setVehiculos ] = useState([]);
    const [ marcas, setMarcas ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const vehiculos = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/vehiculos`).then((res) => res.json());
                const marcas = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/marcas`).then((res) => res.json());
                console.log('Vehiculos:', vehiculos);
                console.log('Marcas:', marcas);
                setVehiculos(vehiculos.payload);
                setMarcas(marcas.payload);
            } catch (error) {
                console.log('Error:', error);
            }
            setLoading(false);
        };
        fetchDatos();
    }, []);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dominio: "",
            modelo: '',
            kmParciales: "0",
            marca: ''
        },
    })

    const onSubmit = async values =>  {
        console.log(values)

        try {
            const newId = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/vehiculos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            }).then((res) => res.json());

            setVehiculos([...vehiculos, { ...values, kmTotales: 0, id: newId }]);
        } catch (error) {
            console.log('Error:', error);
        }
    }

    return (
        <>
        <Form {...form}>
            <p className='text-center text-lg'>Agregar nuevo vehículo</p>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 max-w-lg mx-auto border-4 border-black p-2 rounded">
                <FormField control={form.control} name="dominio" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Patente</FormLabel>
                        <FormControl>
                            <Input placeholder="AYN 135" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>

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
                        )}/>
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
                )}/>

                <FormField control={form.control} name="kmParciales" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Kilometraje</FormLabel>
                        <FormControl>
                            <Input placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>

                <Button className='col-span-full' type="submit">Submit</Button>
            </form>
        </Form>
        <section className='grid grid-cols-7 divide-y divide-gray-800 border-2 border-black rounded'>
            <p className="flex place-content-center">Patente</p>
            <p className="flex place-content-center">Marca</p>
            <p className="flex place-content-center">Modelo</p>
            <p className="flex place-content-center">Kilometraje</p>
            <p className="flex place-content-center">Kilometraje total</p>
            <p className="flex place-content-center">Disponible</p>
            <p></p>

            {
            loading ? <p>Cargando...</p> : vehiculos.map((vehiculo) => (
                <Fragment key={vehiculo.id}>
                    <p className="flex place-content-center">{vehiculo.dominio}</p>
                    <p className="flex place-content-center">{vehiculo.marca}</p>
                    <p className="flex place-content-center">{vehiculo.modelo}</p>
                    <p className="flex place-content-center">{vehiculo.kmParciales}</p>
                    <p className="flex place-content-center">{vehiculo.kmTotales}</p>
                    { vehiculo.kmParciales >= 15000 ? <div className="flex place-content-center"><Image src='./cross.svg' width={30} height={30} alt='Img check' /></div> : <div className="flex place-content-center"><Image src='./check.svg' width={30} height={30} alt='Img check' /></div> }
                    <div className="flex place-content-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger><Image src='./config.svg' width={30} height={30} alt='Img config' /></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Reparar</DropdownMenuItem>
                            <DropdownMenuItem>Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </div>
                </Fragment>
            ))
            }
        </section>

        {
        !loading && vehiculos.length === 0 && <p>No hay vehículos disponibles</p>
        }
        </>
    );
};

export default Vehiculos;
