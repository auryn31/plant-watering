import { PlantOverview } from "@/sql/types";
import { formatDistance } from "date-fns";
import Link from "next/link";

const PlantCard: React.FC<PlantOverview> = ({
  id,
  humidity,
  last_watering,
  name,
  last_watering_in_ml,
}) => {
  return (
    <Link href={`/plant/${id}`} key={id} className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h1 className="card-title">{name}</h1>
        <p>Humidity: {humidity ? humidity : "-"}%</p>
        <p>
          Last watering: {last_watering_in_ml ? last_watering_in_ml : "-"}ml
        </p>
        <p className="text-gray-400 italic">
          Last update:{" "}
          {last_watering ? formatDistance(last_watering, new Date()) : "-"}
        </p>
      </div>
    </Link>
  );
};

export { PlantCard };
