import { checkToken } from "@/app/components/token";
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
  return NextResponse.json({ params });
}
