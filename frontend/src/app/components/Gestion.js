"use client"
import { useState } from "react";
import Choferes from "@/ui/Choferes";
import Vehiculos from "../../ui/Vehiculos";
import Viajes from "../../ui/Viajes";

export default function Gestion () {
  const [ btnChosen, setBtnChosen ] = useState('vehiculos');

  return (
    <section className="px-4 border-2 border-green-700">
      <div className="flex justify-between items-center">
        <p>Gestione aquí sus choferes, autos y viajes</p>

        <nav>
          <ul className="flex gap-4">
            <li>
              <button onClick={() => setBtnChosen('vehiculos')} className={`h-10 w-32 bg-blue-800 text-white rounded md:hover:bg-blue-600 md:active:bg-blue-950 max-md:active:bg-blue-600 ${btnChosen === 'vehiculos' && 'border-4 border-black'}`}>Vehiculos</button>
            </li>
            <li>
              <button onClick={() => setBtnChosen('choferes')} className={`h-10 w-32 bg-blue-800 text-white rounded md:hover:bg-blue-600 md:active:bg-blue-950 max-md:active:bg-blue-600 ${btnChosen === 'choferes' && 'border-4 border-black'}`}>Choferes</button>
            </li>
            <li>
              <button onClick={() => setBtnChosen('viajes')} className={`h-10 w-32 bg-blue-800 text-white rounded md:hover:bg-blue-600 md:active:bg-blue-950 max-md:active:bg-blue-600 ${btnChosen === 'viajes' && 'border-4 border-black'}`}>Viajes</button>
            </li>
          </ul>
        </nav>
      </div>

      <section className={`grid ${btnChosen === 'vehiculos' ? 'grid-cols-7' : ''}`}>
        {btnChosen === 'vehiculos' && <Vehiculos />}
        {btnChosen === 'choferes' && <Choferes />}
        {btnChosen === 'viajes' && <Viajes />}
      </section>
    </section>
  );
}
