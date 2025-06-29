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
import { useBreakpoint } from "@/hooks/util-hooks/use-breakpoints";

// Register Chart.js components globally so we can use them in our charts
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Filler
);

// Define supported chart types
type ChartType = "line" | "bar";

// Props expected by the DottedGridChart component
interface DottedGridChartProps {
  labels: string[]; // X-axis labels
  data: number[]; // Y-axis values
  type?: ChartType; // Line or bar chart
  highlight?: {
    index: number;
    text: string;
  };
  autoSkipXAxisLabels?: boolean;
  height?: number; // Chart height (overridden on mobile below)
  granularity?: "1 Dy" | "1 Wk" | "1 Yr"; // Optional grouping info
}

export default function DottedGridChart({
  labels,
  data,
  type = "line",
  highlight,
  autoSkipXAxisLabels,
  height = 400, // Default height for larger screens
}: DottedGridChartProps) {
  const chartRef = useRef<any>(null); // Ref for the chart instance
  const isMobile = useBreakpoint(); // Detect screen size breakpoint

  // Dynamically reduce chart height on mobile
  const chartHeight = isMobile ? 300 : height;

  // Prepare chart data and appearance
  const chartData = React.useMemo(() => {
    const commonProps = {
      label: "Approval Rating",
      data,
    };

    // Line and bar charts require different styling
    const dataset =
      type === "line"
        ? {
            ...commonProps,
            fill: true,
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.4,

            // Remove dots from line chart for a cleaner look
            pointRadius: 0,
            pointHoverRadius: 0,
          }
        : {
            ...commonProps,
            backgroundColor: "rgba(59, 130, 246, 1)",
            borderRadius: 6,
            barPercentage: 0.6,
          };

    return {
      labels,
      datasets: [dataset],
    };
  }, [labels, data, type]);

  // Configure how the chart is rendered
  const options: ChartOptions<"line" | "bar"> = React.useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      highlightIndex: highlight?.index, // Custom prop used by plugin
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            padding: 8,
            font: { size: 10, family: "Satoshi" },
            maxRotation: 0,
            minRotation: 0,
            maxTicksLimit: isMobile ? 5 : 15,
            autoSkip: labels.length < 5 ? false : true,
          },
        },
        y: {
          beginAtZero: true,
          grid: { display: false },
          border: { display: false },
          ticks: {
            display: true, // Hide vertical axis labels for minimal UI
            padding: 10,
            font: { size: 10, family: "Satoshi" },
            callback: (value) => `${value}`,
            stepSize: 20,
          },
          grace: "0%", // Adds space above the highest Y point
        },
      },
      plugins: {
        tooltip: {
          enabled: true,
          backgroundColor: "rgba(0,0,0,1)",
          titleColor: "#fff",
          bodyColor: "#fff",
          padding: 16,
          cornerRadius: 16,
          displayColors: false,
        },
      },
    }),
    [highlight]
  );

  // Ref for scrolling the container to the rightmost edge
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest data point when labels change
  useEffect(() => {
    scrollContainerRef.current?.scrollTo({
      left: scrollContainerRef.current.scrollWidth,
      behavior: "smooth",
    });
  }, [labels]);

  useEffect(() => {
    const dottedBackgroundPlugin = {
      id: "dottedBackground",
      beforeDatasetsDraw(chart: any) {
        const { ctx, chartArea } = chart;
        if (!chartArea) return;

        ctx.save();
        // ctx.fillStyle = "#CCE4FF";
        ctx.fillStyle = "#d9d9d9";

        // 🔁 Spacing responds to screen size
        const xStep = isMobile ? chartArea.width / 17 : chartArea.width / 45;
        const yStep = isMobile ? chartArea.height / 17 : chartArea.height / 20;

        for (let x = chartArea.left; x <= chartArea.right; x += xStep) {
          for (let y = chartArea.top; y <= chartArea.bottom; y += yStep) {
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Optional highlight line
        if (chart.options.highlightIndex !== undefined) {
          const xPos = chart.scales.x.getPixelForValue(
            chart.options.highlightIndex
          );
          ctx.beginPath();
          ctx.strokeStyle = "rgba(0,0,0,0.2)";
          ctx.moveTo(xPos, chartArea.top);
          ctx.lineTo(xPos, chartArea.bottom);
          ctx.stroke();
        }

        ctx.restore();
      },
    };

    ChartJS.unregister({ id: "dottedBackground" } as any); // safe unregister
    ChartJS.register(dottedBackgroundPlugin);

    return () => {
      ChartJS.unregister(dottedBackgroundPlugin);
    };
  }, [isMobile]);

  // // Custom plugin that draws a dotted background (visual grid)
  // const dottedBackgroundPlugin = {
  //   id: "dottedBackground",
  //   beforeDatasetsDraw(chart: any) {
  //     const { ctx, chartArea } = chart;
  //     if (!chartArea) return;

  //     ctx.save();
  //     ctx.fillStyle = "#D9D9D9";
  //     const xStep = isMobile ? chartArea.width / 100 : chartArea.width / 45;
  //     const yStep = isMobile ? chartArea.height / 100 : chartArea.height / 20;

  //     // Draw small dots in a grid layout across chart area
  //     for (let x = chartArea.left; x <= chartArea.right; x += xStep) {
  //       for (let y = chartArea.top; y <= chartArea.bottom; y += yStep) {
  //         ctx.beginPath();
  //         ctx.arc(x, y, 1.5, 0, Math.PI * 2);
  //         ctx.fill();
  //       }
  //     }

  //     // Optional: draw vertical line to highlight a data point
  //     if (chart.options.highlightIndex !== undefined) {
  //       const xPos = chart.scales.x.getPixelForValue(
  //         chart.options.highlightIndex
  //       );
  //       ctx.beginPath();
  //       ctx.strokeStyle = "rgba(0,0,0,0.2)";
  //       ctx.moveTo(xPos, chartArea.top);
  //       ctx.lineTo(xPos, chartArea.bottom);
  //       ctx.stroke();
  //     }

  //     ctx.restore();
  //   },
  // };

  // // Register the plugin so it affects the chart
  // ChartJS.register(dottedBackgroundPlugin);

  // Select chart component type based on "type" prop
  const ChartComponent = type === "line" ? Line : Bar;

  return (
    <div
      ref={scrollContainerRef}
      style={{ height: chartHeight, overflowX: "auto" }}
      className="w-full pt-4 bg-white rounded-2xl overflow-hidden"
    >
      <div
        className="overflow-hidden md:min-w-full z-50"
        style={{ height: "100%" }}
      >
        <ChartComponent ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
}
