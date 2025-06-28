import { TimeDataBySector } from "@shared/schema";
import {
  generateDayLabels,
  generateWeekLabels,
  generateMonthLabels,
  generateYearLabels,
} from "./time-utils";

export type PeriodKey = "1 Dy" | "1 Wk" | "1 Yr" | "This year";

export function createEmptyTimeData(
  sectorInfo: Array<{ id: string; name: string; color: string }>
) {
  const timeData: {
    periods: Record<PeriodKey, { label: string[]; data: number[] }>;
    sectorData: Record<PeriodKey, TimeDataBySector>;
  } = {
    periods: {
      "1 Dy": { label: generateDayLabels(), data: new Array(24).fill(0) },
      "1 Wk": { label: generateWeekLabels(), data: new Array(7).fill(0) },
      "1 Yr": { label: generateMonthLabels(), data: new Array(12).fill(0) },
      "This year": { label: generateYearLabels(), data: new Array(7).fill(0) },
    },
    sectorData: {
      "1 Dy": {} as TimeDataBySector,
      "1 Wk": {} as TimeDataBySector,
      "1 Yr": {} as TimeDataBySector,
      "This year": {} as TimeDataBySector,
    },
  };

  sectorInfo.forEach(({ id, name, color }) => {
    // (["1 Dy", "1 Wk", "1 Yr", "This year"] as PeriodKey[]).forEach((period) => {
    (["1 Dy", "1 Wk", "1 Yr", "This year"] as PeriodKey[]).forEach((period) => {
      timeData.sectorData[period][name] = {
        sectorId: id,
        color,
        data: new Array(timeData.periods[period].data.length).fill(0),
      };
    });
  });

  return timeData;
}
