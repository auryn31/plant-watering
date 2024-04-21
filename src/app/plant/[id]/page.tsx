import { TokenView } from "@/app/components/tokenView";
import { UpdatePlant } from "@/app/components/updatePlant";
import { getPlant } from "@/app/db/plant";
import { redirect } from "next/navigation";

export default async function Settings({ params }: { params: { id: string } }) {
  const plantData = await getPlant(params.id);
  if (plantData === null) {
    redirect("/");
  }
  return (
    <main className="flex flex-col items-center justify-between">
      <div className="flex flex-col gap-4 items-center p-4">
        <div>
          <h1 className="text-2xl flex flex-row gap-2">
            Plant:{" "}
            <div className="text-gray-300 italic">{plantData.name ?? "-"}</div>
          </h1>
          <TokenView token={params.id} />
        </div>
        <UpdatePlant id={params.id} defaultData={plantData} />
      </div>
    </main>
  );
}
