import { PlantWithValues } from "@/sql/types";
import { formatDistance } from "date-fns";
import Link from "next/link";
import { PlantChart } from "./plantChart";

const PlantCard: React.FC<PlantWithValues> = ({ id, name, values }) => {
  const latestValue = values[values.length - 1];
  return (
    <div className="card bg-base-100 shadow-xl">
      <PlantChart values={values} />
      <div className="card-body">
        <Link href={`/plant/${id}`} key={id}>
          <h1 className="card-title">{name}</h1>
          <p>
            Humidity:{" "}
            {latestValue?.humidity !== undefined ? latestValue.humidity : "-"} %
          </p>
          <p>
            Last watering:{" "}
            {latestValue?.last_watering_in_ml !== undefined
              ? latestValue?.last_watering_in_ml
              : "-"}{" "}
            ml
          </p>
          <p className="text-gray-400 italic">
            Last update:{" "}
            {latestValue?.created_at
              ? formatDistance(latestValue?.created_at, new Date())
              : "-"}
          </p>
        </Link>
      </div>
    </div>
  );
};

export { PlantCard };
