"use client"
import Choferes from "@/app/components/ui/Choferes";
import Vehiculos from "./Vehiculos";
import Viajes from "./Viajes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/Shadcn/tabs"
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/Shadcn/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/Shadcn/form";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/app/components/ui/Shadcn/input";
import { Button } from "@/app/components/ui/Shadcn/button";
import { id } from "date-fns/locale";

const formSchema = z.object({
    precio_por_km: z.string().transform(val => Number(val)).refine((val) => Number.isInteger(val) && val > 0, {
        message: 'El precio debe ser un número natural',
    })
});

export default function Gestion () {
    const [ dataPrecioPorKm, setDataPrecioPorKm ] = useState({});
    const [ loading, setLoading ] = useState(true);
    const [ isDialogOpen, setIsDialogOpen ] = useState(false);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const { payload } = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/precioPorKm/last`).then((res) => res.json());
                console.log('Precio por kilómetro:', payload);
                setDataPrecioPorKm(payload);
                toast("Precio por kilómetro")
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
            precio_por_km: ''
        },
    });

    const guardar = async values => {
        console.log('Form:', values);

        try {
            const { payload } = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/precioPorKm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    precio_por_km: values.precio_por_km
                })
            }).then((res) => res.json());

            console.log('Nuevo precio por kilómetro:', payload);
            setDataPrecioPorKm({ id: payload.newId, precio_por_km: values.precio_por_km, dia: payload.dia, mes: payload.mes, anio: payload.anio });
            setIsDialogOpen(false);
            toast("Precio por kilómetro actualizado")
        } catch (error) {
            console.log('Error:', error);
        }
    };

    return (
        <section className="px-4 border-2 border-green-700">
        <p>Gestione aquí sus choferes, autos y viajes</p>

        {
        dataPrecioPorKm.id &&
        <>
        <p>Precio por kilómetro actual: <span className='font-bold'>${ dataPrecioPorKm.precio_por_km }</span> | Última actualización: {dataPrecioPorKm.dia}/{dataPrecioPorKm.mes}/{dataPrecioPorKm.anio}</p>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger className='my-5 h-10 w-64 bg-blue-800 text-white rounded md:hover:bg-blue-600 md:active:bg-blue-950 max-md:active:bg-blue-600'>Cambiar el precio por kilómetro</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Registrar nuevo precio por kilómetro</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(guardar)} className="grid gap-4 border-4 border-black p-2 rounded">
                            <FormField control={form.control} name="precio_por_km" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Precio por kilómetro</FormLabel>
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

        <Tabs defaultValue="vehiculos">
            <TabsList className='w-full bg-transparent'>
            <div className='mx-auto border-2 border-black rounded bg-gray-950 text-white'>
                <TabsTrigger value="vehiculos">Vehículos</TabsTrigger>
                <TabsTrigger className='mx-5' value="choferes">Choferes</TabsTrigger>
                <TabsTrigger value="viajes">Viajes</TabsTrigger>
            </div>
            </TabsList>
            <TabsContent value="vehiculos"><Vehiculos /></TabsContent>
            <TabsContent value="choferes"><Choferes dataPrecioPorKm={dataPrecioPorKm}/></TabsContent>
            <TabsContent value="viajes"><Viajes dataPrecioPorKm={dataPrecioPorKm} /></TabsContent>
        </Tabs>
        </>
        }
        </section>
    );
}
