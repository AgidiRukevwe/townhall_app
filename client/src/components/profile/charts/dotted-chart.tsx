"use client";
import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Filler,
  type ChartOptions,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Filler
);

type ChartType = "line" | "bar";

interface DottedGridChartProps {
  labels: string[];
  data: number[];
  type?: ChartType;
  highlight?: {
    index: number;
    text: string;
  };
  height?: number;
  granularity?: "Today" | "This week" | "This month" | "This year";
}

export default function DottedGridChart({
  labels,
  data,
  type = "line",
  highlight,
  height = 400,
}: DottedGridChartProps) {
  const chartRef = useRef<any>(null);

  const chartData = React.useMemo(() => {
    const commonProps = {
      label: "Approval Rating",
      data,
    };

    const dataset =
      type === "line"
        ? {
            ...commonProps,
            fill: true,
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 6,
          }
        : {
            ...commonProps,
            backgroundColor: "rgba(59, 130, 246, 0.6)",
            borderRadius: 6,
            barPercentage: 0.6,
          };

    return {
      labels,
      datasets: [dataset],
    };
  }, [labels, data, type]);

  const options: ChartOptions<"line" | "bar"> = React.useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { padding: 10, font: { size: 10 } },
        },
        y: {
          beginAtZero: true,
          grid: { display: false },
          border: { display: false },
          ticks: {
            padding: 10,
            font: { size: 10 },
            callback: (value) => `${value}%`,
          },
          grace: "10%",
        },
      },
      plugins: {
        tooltip: {
          enabled: true,
          backgroundColor: "rgba(0,0,0,0.8)",
          titleColor: "#fff",
          bodyColor: "#fff",
          padding: 10,
          cornerRadius: 24,
          displayColors: false,
        },
      },
    }),
    [highlight]
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollContainerRef.current?.scrollTo({
      left: scrollContainerRef.current.scrollWidth,
      behavior: "smooth",
    });
  }, [labels]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const drawExtras = () => {
      const ctx = chart.canvas.getContext("2d");
      const { chartArea } = chart;
      if (!chartArea) return;

      ctx.save();
      // ctx.fillStyle = "rgba(0,0,0,0.1)";
      ctx.fillStyle = "rgba(0,0,0,0.07)";
      const xStep = chartArea.width / 45;
      const yStep = chartArea.height / 20;
      for (let x = chartArea.left; x <= chartArea.right; x += xStep) {
        for (let y = chartArea.top; y <= chartArea.bottom; y += yStep) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (highlight) {
        const xPos = chart.scales.x.getPixelForValue(highlight.index);
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0,0,0,0.2)";
        ctx.moveTo(xPos, chartArea.top);
        ctx.lineTo(xPos, chartArea.bottom);
        ctx.stroke();
      }

      ctx.restore();
    };

    chart.options.animation = { onComplete: drawExtras };
    drawExtras();

    const ro = new ResizeObserver(drawExtras);
    ro.observe(chart.canvas);
    return () => ro.disconnect();
  }, [chartData, highlight]);

  const ChartComponent = type === "line" ? Line : Bar;

  return (
    <div style={{ height, overflowX: "auto" }} className="w-full">
      <div className="min-w-[768px] md:min-w-full" style={{ height: "100%" }}>
        <ChartComponent ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
}
