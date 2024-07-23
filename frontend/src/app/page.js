import Gestion from "./components/ui/Gestion";
import { Toaster } from "@/app/components/ui/Shadcn/sonner"

export default function Home() {
  return (
    <main className="mx-auto pt-5 max-w-screen-xl">
      <h1 className='text-center text-3xl max-md:text-2xl'>Remisería Buen Viaje</h1>

      <Gestion />
      <Toaster />
    </main>
  );
}
