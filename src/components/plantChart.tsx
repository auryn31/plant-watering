"use client";
import { PlantWithValues } from "@/sql/types";
import Chart from "react-apexcharts";
import { Props } from "react-apexcharts";

const GREEN = "#15803d";
const BLUE = "#1d4ed8";

const PlantChart: React.FC<Pick<PlantWithValues, "values">> = ({ values }) => {
  const displayValues = values
    .filter(
      (it) => it.humidity !== null && it.humidity > 0 && it.humidity <= 100,
    )
    .slice(0, 60)
    .reverse();
  const humidityData = displayValues.map((it) => it.humidity);
  const watering = displayValues.map((it) => it.last_watering_in_ml);
  const createdData = displayValues.map((it) => it.created_at?.getTime());

  const series = [
    {
      name: "Humidity in %",
      data: humidityData,
    },
    {
      name: "Last watering in ml",
      data: watering,
      type: "bar",
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
      colors: [GREEN, BLUE],
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
      yaxis: [
        {
          min: 0,
          max: 100,
          title: {
            text: "Humidity in %",
            style: {
              color: GREEN,
            },
          },
          labels: {
            style: {
              colors: GREEN,
              fontSize: "12px",
              fontWeight: 400,
            },
          },
        },

        {
          opposite: true,
          title: {
            text: "Watering in ml",
            style: {
              color: BLUE,
            },
          },
          labels: {
            style: {
              colors: BLUE,
              fontSize: "12px",
              fontWeight: 400,
            },
          },
        },
      ],
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
