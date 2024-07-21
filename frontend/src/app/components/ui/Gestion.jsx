"use client"
import Choferes from "@/app/components/ui/Choferes";
import Vehiculos from "./Vehiculos";
import Viajes from "./Viajes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/Shadcn/tabs"

export default function Gestion () {
  return (
    <section className="px-4 border-2 border-green-700">
      <p>Gestione aquí sus choferes, autos y viajes</p>

      <Tabs defaultValue="vehiculos">
        <TabsList className='w-full bg-transparent'>
          <div className='mx-auto border-2 border-black rounded bg-gray-950 text-white'>
            <TabsTrigger value="vehiculos">Vehículos</TabsTrigger>
            <TabsTrigger className='mx-5' value="choferes">Choferes</TabsTrigger>
            <TabsTrigger value="viajes">Viajes</TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="vehiculos"><Vehiculos /></TabsContent>
        <TabsContent value="choferes"><Choferes /></TabsContent>
        <TabsContent value="viajes"><Viajes /></TabsContent>
      </Tabs>
    </section>
  );
}
