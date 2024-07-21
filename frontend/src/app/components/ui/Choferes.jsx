// import { useState, useEffect } from "react";

// const limit = 10;

const Choferes = () => {
//   const [ choferes, setChoferes ] = useState([]);
//     const [ pageIndex, setPageIndex ] = useState(1);
//     const [ totalPagesState, setTotalPagesState ] = useState(1);

//   useEffect(() => {
//     const fetchDatos = async () => {
//         try {
//             const { payload } = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/choferes?page=${pageIndex}&limit=${limit}`).then((res) => res.json());
//             const { data, totalPages } = payload;
//             console.log('Choferes:', data);

//             setChoferes(data);
//             setTotalPagesState(totalPages);
//             toast("Choferes")
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
