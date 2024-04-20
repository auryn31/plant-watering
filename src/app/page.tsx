import { PlantCard } from "@/components/plantCard";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { getPlants } from "./db/plant";
import { NewPlantButton } from "./components/newPlant";

export default async function Home() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const plants = await getPlants();
  console.log(plants);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="flex flex-grow w-full justify-center items-center">
        <div className="flex flex-col gap-4">
          <p className="text-2xl">Welcome to PlantR</p>
          <div className="flex flex-row flex-wrap w-full gap-4">
            {plants.map((plant) => (
              <PlantCard {...plant} />
            ))}
          </div>
          <NewPlantButton />
        </div>
      </div>
    </main>
  );
}
