"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { deletePlant, savePlant } from "../db/plant";
import { useRouter } from "next/navigation";
import { Plant } from "@/sql/types";

const UpdatePlant: React.FC<{
  id: string;
  defaultData: Plant;
}> = ({ id, defaultData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Plant>({ defaultValues: defaultData });
  const router = useRouter();

  const onSubmit: SubmitHandler<Plant> = (data: Plant) => {
    savePlant({
      id,
      ...data,
    });
  };

  const deletePlantClicked = async () => {
    await deletePlant(id);
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label className="label">
        <span className="label-text">Name</span>
        <input
          type="text"
          placeholder="Plant name"
          className="input"
          {...register("name", { required: true })}
        />
      </label>
      <label className="label">
        <span className="label-text">Target Humidity</span>
        <input
          type="number"
          {...register("desired_humidity", { required: true })}
          placeholder="10"
          className="input"
        />
      </label>
      <label className="label">
        <span className="label-text">ml per watering</span>
        <input
          type="number"
          placeholder="100"
          className="input"
          {...register("ml_per_watering", { required: true })}
        />
      </label>
      <label className="label">
        <span className="label-text">Max ml per day</span>
        <input
          type="number"
          placeholder="100"
          className="input"
          {...register("max_ml_per_day", { required: true })}
        />
      </label>
      <button className="btn btn-primary">Save</button>
      <button
        className="btn btn-error"
        onClick={() => {
          deletePlantClicked();
        }}
      >
        Delete
      </button>
    </form>
  );
};
export { UpdatePlant };
