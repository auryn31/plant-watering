import { PlantWithValues } from "@/sql/types";
import { formatDistance } from "date-fns";
import Link from "next/link";
import { PlantChart } from "./plantChart";

const PlantCard: React.FC<PlantWithValues> = ({ id, name, values }) => {
  const latestValue = values.sort((a, b) => {
    if (a.created_at && b.created_at) {
      return b.created_at.getTime() - a.created_at.getTime();
    }
    return 0;
  })[0];
  const wateringToday = values
    .map((it) => it.last_watering_in_ml)
    .map((it) => it ?? 0)
    .reduce((acc, it) => acc + it, 0);
  return (
    <div className="grow card bg-base-100 shadow-xl max-w-3xl">
      <PlantChart values={values} />
      <div className="card-body">
        <Link href={`/plant/${id}`} key={id}>
          <h1 className="card-title">{name ?? "Name: -"}</h1>
          <p>
            Humidity:{" "}
            {latestValue?.humidity !== undefined ? latestValue.humidity : "-"} %
          </p>
          <p>Watered today: {wateringToday} ml</p>
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
