"use server";
import { getSession } from "@auth0/nextjs-auth0";
import { DB, Plant, PlantValue, PlantWithValues } from "@/sql/types";
import { createKysely } from "@vercel/postgres-kysely";

const db = createKysely<DB>();

interface PlantWithWatering extends Plant {
  water_today: number | null;
  last_humidity: number | null;
  last_watering_value_pushed: Date | null;
}

async function getPlant(id: string): Promise<PlantWithWatering | null> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const allPlantValuesSubquery = db
    .selectFrom("plant_values as pv")
    .select([
      "pv.plant_id",
      "pv.humidity",
      "pv.last_watering_in_ml",
      "pv.created_at",
    ])
    .orderBy("created_at", "desc")
    .where("pv.created_at", ">=", today)
    .as("pv");

  const result = await db
    .selectFrom("plant as pl")
    .leftJoin(allPlantValuesSubquery, (join) =>
      join.onRef("pl.id", "=", "pv.plant_id"),
    )
    .select([
      "pl.id",
      "pl.name",
      "pl.created_at",
      "pl.desired_humidity",
      "pl.max_ml_per_day",
      "pl.ml_per_watering",
      "pl.token_id",
      "pv.humidity",
      "pv.plant_id",
      "pv.last_watering_in_ml",
      "pv.created_at as value_timestamp",
    ])
    .where("pl.id", "=", id)
    .execute();
  const mapped = mapResult(result);
  if (mapped.length === 0) {
    throw new Error("Plant not found");
  }
  const plant = mapped[0];
  console.log(plant);
  const water_today = plant.values.reduce(
    (acc, value) => acc + (value.last_watering_in_ml ?? 0),
    0,
  );
  const last_humidity = plant.values[0].humidity;
  const last_watering_value_pushed = plant.values[0].created_at;

  return {
    id: plant.id,
    name: plant.name,
    created_at: plant.created_at,
    desired_humidity: plant.desired_humidity,
    max_ml_per_day: plant.max_ml_per_day,
    ml_per_watering: plant.ml_per_watering,
    token_id: plant.token_id,
    water_today,
    last_humidity,
    last_watering_value_pushed,
  };
}
async function getPlants(): Promise<PlantWithValues[]> {
  const session = await getSession();
  if (!session) {
    return [];
  }
  const user = session.user;
  try {
    const token = await getToken(user.sub);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const allPlantValuesSubquery = db
      .selectFrom("plant_values as pv")
      .select([
        "pv.plant_id",
        "pv.humidity",
        "pv.last_watering_in_ml",
        "pv.created_at",
      ])
      .orderBy("created_at", "desc")
      .where("pv.created_at", ">=", today)
      .as("pv");
    // const allPlantValuesSubquery = db
    //   .selectFrom("plant_values as pv")
    //   .select([
    //     "pv.plant_id",
    //     "pv.humidity",
    //     "pv.last_watering_in_ml",
    //     "pv.created_at",
    //   ])
    //   .orderBy("created_at", "desc")
    //   .limit(12)
    //   .as("pv");

    const result = await db
      .selectFrom("plant as pl")
      .leftJoin(allPlantValuesSubquery, (join) =>
        join.onRef("pl.id", "=", "pv.plant_id"),
      )
      .select([
        "pl.id",
        "pl.name",
        "pl.created_at",
        "pl.desired_humidity",
        "pl.max_ml_per_day",
        "pl.ml_per_watering",
        "pl.token_id",
        "pv.humidity",
        "pv.plant_id",
        "pv.last_watering_in_ml",
        "pv.created_at as value_timestamp",
      ])
      .where("pl.token_id", "=", token)
      .execute();
    const mapped = mapResult(result);
    // console.log(mapped);
    // Perform the query with a left join
    // const result = await db
    //   .selectFrom("plant as pl")
    //   .leftJoin(latestPlantValuesSubquery, (join) =>
    //     join.onRef("pl.id", "=", "pv.plant_id"),
    //   )
    //   .select([
    //     "pl.id",
    //     "pl.name",
    //     "pv.humidity",
    //     "pv.last_watering_in_ml",
    //     "pv.created_at as last_watering",
    //   ])
    //   .where("pl.token_id", "=", token)
    //   .execute();

    return mapped ?? [];
  } catch (e) {
    console.error(e);
    return [];
  }
}

interface PlantEntry extends Plant {
  id: string;
  plant_id: string | null;
  name: string | null;
  humidity: number | null;
  last_watering_in_ml: number | null;
  value_timestamp: Date | null;
}

const mapResult = (entries: PlantEntry[]): PlantWithValues[] => {
  const grouped: Record<string, PlantWithValues> = {};
  entries.forEach((entry) => {
    if (!grouped[entry.id]) {
      grouped[entry.id] = {
        ...entry,
        values: [],
      };
    }
    grouped[entry.id].values.push({
      plant_id: entry.plant_id,
      created_at: entry.value_timestamp,
      last_watering_in_ml: entry.last_watering_in_ml,
      humidity: entry.humidity,
    });
  });
  return Object.values(grouped);
};

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
