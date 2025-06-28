import { TimeDataBySector } from "@shared/schema";
import {
  generateDayLabels,
  generateWeekLabels,
  generateMonthLabels,
  generateYearLabels,
} from "./time-utils";

export function transformToSectorPeriodData(sectorData: {
  [period: string]: TimeDataBySector;
}) {
  const now = new Date();
  const periodLabels: Record<string, string[]> = {
    "1 Dy": generateDayLabels(now),
    "1 Wk": generateWeekLabels(now),
    "1 Yr": generateMonthLabels(now),
    "This year": generateYearLabels(now),
  };

  const result: Record<
    string,
    {
      "1 Dy": { data: number[]; labels: string[] };
      "1 Wk": { data: number[]; labels: string[] };
      "1 Yr": { data: number[]; labels: string[] };
      "This year": { data: number[]; labels: string[] };
    }
  > = {};

  for (const period of ["1 Dy", "1 Wk", "1 Yr", "This year"] as const) {
    const labels = periodLabels[period];

    for (const sectorKey in sectorData[period]) {
      const sectorEntry = sectorData[period][sectorKey];

      if (!result[sectorKey]) {
        result[sectorKey] = {
          "1 Dy": { data: [], labels: [] },
          "1 Wk": { data: [], labels: [] },
          "1 Yr": { data: [], labels: [] },
          "This year": { data: [], labels: [] },
        };
      }

      result[sectorKey][period] = {
        data: sectorEntry.data,
        labels,
      };
    }
  }

  return result;
}

// const result: Record<
//   string, // sectorId or sectorName (use consistent keys)
//   {
//     "1 Dy": number[];
//     "1 Wk": number[];
//     "1 Yr": number[];
//     "This year": number[];
//   }
// > = {};

// for (const period of ["1 Dy", "1 Wk", "1 Yr", "This year"] as const) {
//   for (const sectorKey in sectorData[period]) {
//     const sectorEntry = sectorData[period][sectorKey];
//     if (!result[sectorKey]) {
//       result[sectorKey] = {
//         "1 Dy": [],
//         "1 Wk": [],
//         "1 Yr": [],
//         "This year": [],
//       };
//     }
//     result[sectorKey][period] = sectorEntry.data;
//   }
// }

//   return result;
// }

// import { TimeDataBySector } from "@shared/schema";
// import {
//   generateDayLabels,
//   generateWeekLabels,
//   generateMonthLabels,
//   generateYearLabels,
// } from "./time-utils";

// export function transformToSectorPeriodData(sectorData: {
//   [period: string]: TimeDataBySector;
// }) {
//   const now = new Date();
//   const periodLabels: Record<string, string[]> = {
//     "1 Dy": generateDayLabels(now),
//     "1 Wk": generateWeekLabels(now),
//     "1 Yr": generateMonthLabels(now),
//     "This year": generateYearLabels(now),
//   };

//   const result: Record<
//     string,
//     {
//       "1 Dy": { data: number[]; labels: string[] };
//       "1 Wk": { data: number[]; labels: string[] };
//       "1 Yr": { data: number[]; labels: string[] };
//       "This year": { data: number[]; labels: string[] };
//     }
//   > = {};

//   for (const period of ["1 Dy", "1 Wk", "1 Yr", "This year"] as const) {
//     const labels = periodLabels[period];

//     for (const sectorKey in sectorData[period]) {
//       const sectorEntry = sectorData[period][sectorKey];

//       if (!result[sectorKey]) {
//         result[sectorKey] = {
//           "1 Dy": { data: [], labels: [] },
//           "1 Wk": { data: [], labels: [] },
//           "1 Yr": { data: [], labels: [] },
//           "This year": { data: [], labels: [] },
//         };
//       }

//       result[sectorKey][period] = {
//         data: sectorEntry.data,
//         labels,
//       };
//     }
//   }

//   return result;
// }
