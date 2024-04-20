import Link from "next/link";

type PlantCardProps = {
  id: string;
  humidity: number;
  last_watering: Date;
  name: string;
};
const PlantCard: React.FC<PlantCardProps> = ({
  id,
  humidity,
  last_watering,
  name,
}) => {
  return (
    <Link href={`/plant/${id}`} key={id} className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h1 className="card-title">{name}</h1>
        <p>Last watering: {last_watering?.toUTCString()}</p>
        <p>Humidity: {humidity}%</p>
      </div>
    </Link>
  );
};

export { PlantCard };
