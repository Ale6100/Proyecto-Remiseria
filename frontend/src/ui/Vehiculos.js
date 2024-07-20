import { useEffect, useState } from "react";
const Vehiculos = () => {
    const [ vehiculos, setVehiculos ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {

        const fetchChoferes = async () => {
            try {
                const result = await fetch("http://localhost:8080/vehiculos").then((res) => res.json());
                console.log('Vehiculos:', result);
                setVehiculos(result.payload);
            } catch (error) {
                console.log('Error:', error);
            }
            setLoading(false);
        };
        fetchChoferes();
    }, []);

    if (!loading && vehiculos.length === 0) {
        return <p>No hay vehículos disponibles</p>;
    }

    return (
        <>
        <div>Patente</div>
        <div>Marca</div>
        <div>Modelo</div>
        <div>Año</div>
        <div>Kilómetros</div>
        <div>Kilómetros totales</div>
        <div>Disponible</div>

        {
            loading ? <p>Cargando...</p> : vehiculos.map((vehiculo) => (
                <div key={vehiculo.id}>
                    <div>{vehiculo.dominio}</div>
                    <div>{vehiculo.marca}</div>
                    <div>{vehiculo.modelo}</div>
                    <div>{vehiculo.anio}</div>
                    <div>{vehiculo.kmParciales}</div>
                    <div>{vehiculo.kmTotales}</div>
                    <div>Calcular disponibilidad</div>
                </div>
            ))
        }
        </>
    );
};

export default Vehiculos;
