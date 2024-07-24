"use client"
import Choferes from "@/app/components/ui/Choferes";
import Vehiculos from "./Vehiculos";
import Viajes from "./Viajes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/Shadcn/tabs"
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/Shadcn/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/Shadcn/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/app/components/ui/Shadcn/input";
import { Button } from "@/app/components/ui/Shadcn/button";
import { Loader2 } from "lucide-react";
import Loader from "./Loader";
import { fetcher } from "../lib/utils";

const formSchema = z.object({
    precio_por_km: z.string().transform(val => Number(val)).refine(val => Number.isInteger(val) && val > 0 && val < 1000000, { message: 'El precio debe ser un número natural menor a 1000000' })
});

export default function Gestion () {
    const [ dataPrecioPorKm, setDataPrecioPorKm ] = useState({});
    const [ loading, setLoading ] = useState(true);
    const [ isDialogOpen, setIsDialogOpen ] = useState(false);
    const [ saveIsLoading, setSaveIsLoading ] = useState(false);

    useEffect(() => {
        const fetchDatos = async () => {
            const response = await fetcher('precioPorKm/last');

            if (response.statusCode === 200) {
                setDataPrecioPorKm(response.payload);
            } else if (response.statusCode !== 500) {
                toast(response.error);
            } else {
                toast("Error interio. Por favor intente de nuevo más tarde")
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
        setSaveIsLoading(true);
        try {
            const response = await fetcher('precioPorKm', { method: 'POST', body: { precio_por_km: values.precio_por_km } });

            if (response.statusCode === 200) {
                const { payload } = response;
                setDataPrecioPorKm({ id: payload.newId, precio_por_km: values.precio_por_km, dia: payload.dia, mes: payload.mes, anio: payload.anio });
                toast("Precio por kilómetro actualizado")
            } else if (response.statusCode !== 500) {
                toast(response.error);
            } else {
                toast("Error interio. Por favor intente de nuevo más tarde")
            }
        } catch (error) {
           toast("Error interno. Por favor intente de nuevo más tarde")
        }
        setSaveIsLoading(false);
        setIsDialogOpen(false);
    };

    return (
        <section className="px-4">
        <p className='my-3'>Gestione aquí sus vehículos, choferes y viajes</p>

        {
        loading ?
        <div className='flex flex-col gap-10 items-center'>
            <p className='max-md:text-sm'>Por favor espere. El servidor gratuito donde alojo el backend se suspende por inactividad</p>
            <Loader />
        </div>
        : dataPrecioPorKm.id ?
        <>
        <div className='flex flex-col gap-3'>
            <p>Precio por kilómetro actual: <span className='font-bold'>${ dataPrecioPorKm.precio_por_km }</span> </p>
            <div className='flex max-md:justify-between md:gap-5'>
                <p>Última actualización: {dataPrecioPorKm.dia}/{dataPrecioPorKm.mes}/{dataPrecioPorKm.anio}</p>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger className='h-6 w-20 bg-blue-800 text-white rounded md:hover:bg-blue-600 md:active:bg-blue-950 max-md:active:bg-blue-600'>Cambiar</DialogTrigger>
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

                                <Button className='col-span-full' type="submit" disabled={saveIsLoading}>
                                    {saveIsLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</> : "Guardar"}
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>

        <hr className='my-10 border-black border-dashed'></hr>

        <Tabs defaultValue="vehiculos">
            <TabsList className='w-full bg-transparent'>
            <div className='mx-auto border-black rounded bg-gray-950 text-white'>
                <TabsTrigger value="vehiculos">Vehículos</TabsTrigger>
                <TabsTrigger className='mx-5' value="choferes">Choferes</TabsTrigger>
                <TabsTrigger value="viajes">Viajes</TabsTrigger>
            </div>
            </TabsList>
            <TabsContent value="vehiculos"><Vehiculos /></TabsContent>
            <TabsContent value="choferes"><Choferes dataPrecioPorKm={dataPrecioPorKm} /></TabsContent>
            <TabsContent value="viajes"><Viajes dataPrecioPorKm={dataPrecioPorKm} /></TabsContent>
        </Tabs>
        </>
        : <p>El servidor no responde, por favor intente de nuevo más tarde</p>
        }
        </section>
    );
}
