"use server";
import { getSession } from "@auth0/nextjs-auth0";
import { DB, Plant, PlantOverview, PlantValue } from "@/sql/types";
import { createKysely } from "@vercel/postgres-kysely";

const db = createKysely<DB>();

async function getPlant(id: string): Promise<Plant | null> {
  const result = await db
    .selectFrom("plant")
    .selectAll()
    .where("plant.id", "=", id)
    .executeTakeFirstOrThrow();
  return result;
}
async function getPlants(): Promise<PlantOverview[]> {
  const session = await getSession();
  if (!session) {
    return [];
  }
  const user = session.user;
  try {
    const token = await getToken(user.sub);

    const maxCreatedAtSubquery = db
      .selectFrom("plant_values")
      .select(["plant_id", db.fn.max("created_at").as("max_created_at")])
      .groupBy("plant_id")
      .as("latest");

    // Define the subquery for the latest plant values
    const latestPlantValuesSubquery = db
      .selectFrom("plant_values as pv")
      .innerJoin(maxCreatedAtSubquery, (join) =>
        join.onRef("latest.plant_id", "=", "pv.plant_id"),
      )
      .select([
        "pv.plant_id",
        "pv.humidity",
        "pv.last_watering_in_ml",
        "pv.created_at",
      ])
      .whereRef("pv.created_at", "=", "latest.max_created_at")
      .as("pv");

    // Perform the query with a left join
    const result = await db
      .selectFrom("plant as pl")
      .leftJoin(latestPlantValuesSubquery, (join) =>
        join.onRef("pl.id", "=", "pv.plant_id"),
      )
      .select([
        "pl.id",
        "pl.name",
        "pv.humidity",
        "pv.last_watering_in_ml",
        "pv.created_at as last_watering",
      ])
      .where("pl.token_id", "=", token)
      .execute();

    return result ?? [];
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function savePlant(plant: Plant): Promise<number> {
  const session = await getSession();
  if (!session) {
    return 0;
  }
  const token = await getToken(session.user.sub);
  const updated = await db
    .updateTable("plant")
    .set(plant)
    .where("id", "=", plant.id)
    .where("token_id", "=", token)
    .execute();
  return updated.length;
}
async function createPlant(): Promise<string | null> {
  const session = await getSession();
  if (!session) {
    return null;
  }
  const user = session.user;
  const id = crypto.randomUUID();
  const token_id = await getToken(user.sub);
  await db
    .insertInto("plant")
    .values({ id, token_id })
    .executeTakeFirstOrThrow();
  return id;
}

const getToken = async (userId: string): Promise<string> => {
  const token = await db
    .selectFrom("token")
    .select("token_id")
    .where("user_id", "=", userId)
    .executeTakeFirstOrThrow();
  return token.token_id;
};

async function deletePlant(id: string) {
  const session = await getSession();
  if (!session) {
    return null;
  }
  const token = await getToken(session.user.sub);
  await db.deleteFrom("plant_values").where("plant_id", "=", id).execute();
  await db
    .deleteFrom("plant")
    .where("id", "=", id)
    .where("token_id", "=", token)
    .execute();
}

const addPlantValue = async (values: PlantValue): Promise<number> => {
  const result = await db.insertInto("plant_values").values(values).execute();
  return result.length;
};

export {
  getPlant,
  savePlant,
  getPlants,
  createPlant,
  deletePlant,
  addPlantValue,
};
