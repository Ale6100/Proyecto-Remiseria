import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export async function fetcher(relativeUrl, { method = 'GET', body = null } = {}) {
  return fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/${relativeUrl}`, {
    method: method,
    body: body ? JSON.stringify(body) : null,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`
    }
  }).then(res => res.json())
}

export function agregarDisponibilidadChoferes(choferes) {
  return choferes.map(chofer => {
    const aniosAgregados = chofer.tipo === 'profesionales' ? 1 : 5;
    const dateEmision = new Date(chofer.fechaEmision);
    return {
      ...chofer,
      disponible: dateEmision.setFullYear(dateEmision.getFullYear()+aniosAgregados) > new Date()
    }
  })
}

export function agregarDisponibilidadVehiculos(vehiculos) {
  return vehiculos.map(vehiculo => {
    return {
      ...vehiculo,
      disponible: vehiculo.kmParciales < 15000
    }
  })
}

export function completarDatosViajes(viaje, choferes, vehiculos) {
  return viaje.map(v => {
    return {
      ...v,
      chofer: choferes.find(c => c.id == v.chofer_id),
      vehiculo: vehiculos.find(ve => ve.id == v.vehiculo_id)
    }
  })
}
