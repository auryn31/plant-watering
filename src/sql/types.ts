import type { ColumnType } from "kysely";
import { z } from "zod";

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;

export interface Plant {
  created_at: Date | null;
  desired_humidity: number | null;
  id: string;
  max_ml_per_day: number | null;
  ml_per_watering: number | null;
  name: string | null;
  token_id: string | null;
  watering_allowed: boolean | null;
}

export interface PlantOverview {
  id: string | null;
  name: string | null;
  humidity: number | null;
  last_watering_in_ml: number | null;
  last_watering: Date | null;
}

export interface PlantWithValues extends Plant {
  values: Array<PlantValues>;
}

export interface PlantUser {
  created_at: Date | null;
  email: string | null;
  name: string | null;
  user_id: string;
}

export interface PlantValues {
  created_at: Date | null;
  humidity: number | null;
  last_watering_in_ml: number | null;
  plant_id: string | null;
}

export interface Token {
  created_at: Date | null;
  token_id: string;
  user_id: string;
}

export interface DB {
  plant: Plant;
  plant_user: PlantUser;
  plant_values: PlantValues;
  token: Token;
}

const PlantValue = z
  .object({
    plant_id: z.string().optional(),
    humidity: z.number(),
    last_watering_in_ml: z.number(),
    created_at: z.date().optional(),
  })
  .strict();

type PlantValue = z.infer<typeof PlantValue>;
export { PlantValue };
