import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await sql`DROP TABLE if exists tokens`;
    const result =
      await sql`CREATE TABLE tokens ( user_id varchar(255), token varchar(255) );`;

    await sql`DROP TABLE if exists plants`;
    const plant_result =
      await sql`create table plants (id varchar(255), user_id varchar(255), name varchar(255))`;
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
