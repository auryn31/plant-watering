import { z } from "zod";

const PlantUpdate = z
  .object({
    humidity: z.number(),
    last_watering_in_ml: z.number(),
  })
  .strict();

type PlantUpdate = z.infer<typeof PlantUpdate>;

export { PlantUpdate };
