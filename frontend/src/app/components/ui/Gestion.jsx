"use client"
import Choferes from "@/app/components/ui/Choferes";
import Vehiculos from "./Vehiculos";
import Viajes from "./Viajes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/Shadcn/tabs"
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Gestion () {
    const [ dataPrecioPorKm, setDataPrecioPorKm ] = useState({});
    const [ loading, setLoading ] = useState(true);

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

    return (
        <section className="px-4 border-2 border-green-700">
        <p>Gestione aquí sus choferes, autos y viajes</p>

        {
        dataPrecioPorKm.id && <p>Precio por kilómetro actual: ${ dataPrecioPorKm.precio_por_km } | Última actualización: {dataPrecioPorKm.mes}/{dataPrecioPorKm.anio}</p>
        }

        <Tabs defaultValue="choferes">
            <TabsList className='w-full bg-transparent'>
            <div className='mx-auto border-2 border-black rounded bg-gray-950 text-white'>
                <TabsTrigger value="vehiculos">Vehículos</TabsTrigger>
                <TabsTrigger className='mx-5' value="choferes">Choferes</TabsTrigger>
                <TabsTrigger value="viajes">Viajes</TabsTrigger>
            </div>
            </TabsList>
            <TabsContent value="vehiculos"><Vehiculos /></TabsContent>
            <TabsContent value="choferes"><Choferes /></TabsContent>
            <TabsContent value="viajes"><Viajes dataPrecioPorKm={dataPrecioPorKm} /></TabsContent>
        </Tabs>
        </section>
    );
}
