import { addPlantValue, getPlant } from "@/app/db/plant";
import { checkToken } from "@/app/db/token";
import { PlantValue } from "@/sql/types";
import { NextResponse } from "next/server";

type Params = {
  params: {
    id: string;
    plant_id: string;
  };
};

export async function GET(_req: Request, { params }: Params) {
  const tokenIsValid = await checkToken(params.id);
  if (!tokenIsValid) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  const plant = await getPlant(params.plant_id);
  return NextResponse.json({ plant });
}

export async function PUT(req: Request, { params }: Params) {
  const tokenIsValid = await checkToken(params.id);
  if (!tokenIsValid) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const plantUpdate = PlantValue.parse(body);
    const result = await addPlantValue({
      ...plantUpdate,
      plant_id: params.plant_id,
    });
    if (result === 0) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    } else {
      return NextResponse.json(plantUpdate);
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Format does not fit requirenments" },
      { status: 400 },
    );
  }
}
