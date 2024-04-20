import { z } from "zod";

type Token = {
  user_id: string;
  token_id: string;
  created_at: Date;
};

type User = {
  user_id: string;
  name: string;
  email: string;
  created_at: Date;
};

type Plant = {
  id: string;
  token_id: string;
  name: string;
  ml_per_watering: number;
  max_ml_per_day: number;
  desired_humidity: number;
  created_at: Date;
};

// type PlantValue = {
//   plant_id: string;
//   humidity: number;
//   last_watering_in_ml: number;
//   created_at: Date;
// };

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
export type { Token, User, Plant };
