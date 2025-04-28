import Receta from "@/components/Receta"

export default function Home (){
  return(
    <div className=" bg-gray-200 p-2 flex flex-col  items-center gap-10 sm:h-full md:h-full lg:h-screen xl:h-screen">
      <h1 className="text-3xl pt-10 text-red-600">Bienvenido al recetario de Juan</h1>
      <div className="flex flex-col items-center justify-center p-2 bg-white rounded-lg shadow-md">
        <Receta/>


      </div>

    </div>
  )
}