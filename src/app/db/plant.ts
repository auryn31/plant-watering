"use server";
import { sql } from "@vercel/postgres";
import { getSession } from "@auth0/nextjs-auth0";
import { Plant, PlantValue } from "@/sql/types";

async function getPlant(id: string): Promise<Plant | null> {
  const result = await sql`SELECT * FROM plant WHERE id = ${id}`;
  console.log(result);
  return result.rows[0] ?? null;
}
async function getPlants(): Promise<Plant[]> {
  const session = await getSession();
  if (!session) {
    return [];
  }
  const user = session.user;
  const token_select =
    await sql`select token_id from token where user_id=${user.sub}`;
  if (!token_select.rows || token_select.rows.length == 0) {
    return [];
  }
  const token = token_select.rows[0].token_id;
  const result =
    await sql`SELECT id, name FROM plant WHERE token_id = ${token}`;
  return result.rows ?? [];
}

async function savePlant(plant: Plant): Promise<number> {
  const session = await getSession();
  if (!session) {
    return 0;
  }
  const token = await getToken(session.user.sub);
  const updated =
    await sql`UPDATE plant SET name = ${plant.name}, ml_per_watering= ${plant.ml_per_watering}, max_ml_per_day = ${plant.max_ml_per_day}, desired_humidity = ${plant.desired_humidity}  WHERE token_id = ${token} AND id = ${plant.id}`;
  return updated.rowCount;
}
async function createPlant(): Promise<string | null> {
  const session = await getSession();
  if (!session) {
    return null;
  }
  const user = session.user;
  const id = crypto.randomUUID();
  const token = await getToken(user.sub);
  await sql`INSERT INTO plant (id, token_id) VALUES (${id}, ${token})`;
  return id;
}

const getToken = async (userId: string): Promise<string> => {
  const token_select =
    await sql`select token_id from token where user_id=${userId}`;
  const token = token_select.rows[0].token_id;
  return token;
};

async function deletePlant(id: string) {
  const session = await getSession();
  if (!session) {
    return null;
  }
  const user = session.user;
  await sql`DELETE FROM plant WHERE user_id = ${user.sub} AND id = ${id}`;
}

const addPlantValue = async (values: PlantValue): Promise<number> => {
  const result =
    await sql`insert into plant_values (plant_id, humidity, last_watering_in_ml) values (${values.plant_id}, ${values.humidity}, ${values.last_watering_in_ml})`;
  return result.rowCount;
};

export {
  getPlant,
  savePlant,
  getPlants,
  createPlant,
  deletePlant,
  addPlantValue,
};
