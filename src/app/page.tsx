import { PlantCard } from "@/components/plantCard";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { getPlants } from "./db/plant";
import { NewPlantButton } from "./components/newPlant";
import { getToken } from "./db/token";
import { TokenView } from "./components/tokenView";

export default async function Home() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const plants = await getPlants();
  const token = await getToken();

  return (
    <main className="flex grow h-full flex-col items-center">
      <div className="flex flex-grow w-full justify-center items-center">
        <div className="w-full flex flex-col gap-4">
          <p className="text-3xl m-6 ">Your plants</p>
          <div className="flex flex-row flex-wrap justify-center w-full gap-4 px-6">
            {plants.map((plant) => (
              <PlantCard key={plant.id} {...plant} />
            ))}
          </div>
          <div className="flex flex-row justify-center">
            <NewPlantButton />
          </div>
          <div className="flex flex-row justify-center">
            <TokenView token={token ?? "-"} />
          </div>
        </div>
      </div>
    </main>
  );
}
