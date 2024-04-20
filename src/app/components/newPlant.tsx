"use client";
import { createPlant } from "../db/plant";
import { useRouter } from "next/navigation";

const NewPlantButton: React.FC = () => {
  const router = useRouter();
  const addPlant = async () => {
    const plantId = await createPlant();
    console.log(plantId);
    router.push(`/plant/${plantId}`);
  };

  return (
    <button className="btn" onClick={addPlant}>
      Add Plant
    </button>
  );
};

export { NewPlantButton };
