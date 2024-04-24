"use client";
import { PlantWithValues } from "@/sql/types";
import Chart from "react-apexcharts";
import { Props } from "react-apexcharts";

const PlantChart: React.FC<Pick<PlantWithValues, "values">> = ({ values }) => {
  const displayValues = values
    .filter(
      (it) => it.humidity !== null && it.humidity > 0 && it.humidity < 100,
    )
    .slice(0, 60)
    .reverse();
  const humidityData = displayValues.map((it) => it.humidity);
  const createdData = displayValues.map((it) => it.created_at?.getTime());

  const series = [
    {
      name: "Humidity in %",
      data: humidityData,
    },
  ];
  const chartConfig: Props = {
    type: "line",
    height: 240,
    options: {
      grid: {
        yaxis: {
          lines: {
            show: false,
          },
        },
      },
      chart: {
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#fff"],
      stroke: {
        lineCap: "round",
        curve: "smooth",
      },
      markers: {
        size: 0,
      },
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "#616161",
            fontSize: "0.75rem",
            fontWeight: 400,
          },
        },
        categories: createdData,
        type: "datetime",
      },
      yaxis: {
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontWeight: 400,
          },
        },
      },
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        theme: "dark",
      },
    },
  };
  return (
    <div>
      <Chart {...chartConfig} series={series} />
    </div>
  );
};

export { PlantChart };
