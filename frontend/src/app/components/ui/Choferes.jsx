// import { useState, useEffect } from "react";

const Choferes = () => {
//   const [ choferes, setChoferes ] = useState([]);
//     const [ pageIndex, setPageIndex ] = useState(1);
//     const [ totalPagesState, setTotalPagesState ] = useState(1);

//   useEffect(() => {
//     const fetchDatos = async () => {
//         try {
//             const { payload } = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/choferes?page=${pageIndex}&limit=${limit}`).then((res) => res.json());
//             const { data, totalPages } = payload;
//             const marcas = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/marcas`).then((res) => res.json());
//             console.log('Vehiculos:', data);
//             console.log('Marcas:', marcas);
//             setVehiculos(data);
//             setTotalPagesState(totalPages);
//             setMarcas(marcas.payload);
//             toast("Event has been created.")
//         } catch (error) {
//             console.log('Error:', error);
//         }
//         setLoading(false);
//     };
//     fetchDatos();
// }, [pageIndex]);

  return (
    <div>Choferes: </div>
  );
};

export default Choferes;

/*
Cada columna tiene:
- Nombre
- Apellido
- DNI
- Kilometros que manejó (Se calcula con la tabla viajes)
- Precio por kilometro
- Tipo de licencia
- Fecha de vencimiento de la licencia
- Habilitado para conducir (licencia no vencida)
*/
