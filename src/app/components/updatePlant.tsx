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
      ...data,
      id,
    });
  };

  const deletePlantClicked = async () => {
    await deletePlant(id);
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label className="label flex gap-4">
        <span className="label-text">Name</span>
        <input
          type="text"
          placeholder="Plant name"
          className="input"
          {...register("name", { required: true })}
        />
      </label>
      <label className="label flex gap-4">
        <span className="label-text">Target Humidity</span>
        <input
          type="number"
          {...register("desired_humidity", { required: true })}
          placeholder="10"
          className="input"
        />
      </label>
      <label className="label flex gap-4">
        <span className="label-text">ml per watering</span>
        <input
          type="number"
          placeholder="100"
          className="input"
          {...register("ml_per_watering", { required: true })}
        />
      </label>
      <label className="label flex gap-4">
        <span className="label-text">Max ml per day</span>
        <input
          type="number"
          placeholder="100"
          className="input"
          {...register("max_ml_per_day", { required: true })}
        />
      </label>
      <div className="w-full justify-end gap-4 flex flex-row pt-4">
        <button className="btn btn-accent">Save</button>
        <button
          className="btn btn-error text-white"
          onClick={() => {
            deletePlantClicked();
          }}
        >
          Delete
        </button>
      </div>
    </form>
  );
};
export { UpdatePlant };
