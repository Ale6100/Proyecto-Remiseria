import Gestion from "./components/Gestion";

export default async function Home() {
  return (

    <main className="mx-auto mt-10 max-w-screen-xl border-2 border-black border-dashed">
      <h1 className='text-center text-3xl'>Remisería Buen Viaje</h1>

      <Gestion />
    </main>
  );
}
