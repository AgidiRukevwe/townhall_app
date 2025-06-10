import { Rating, TimeDataBySector, TimeDataset } from "@shared/schema";

/**
 * Generates time-based data across different periods using actual ratings data
 * @param ratings Array of ratings with timestamps, sector information, and values
 * @returns Structured time data with period and sector breakdowns
 */
export function generateTimeBasedData(
  ratings: Array<{
    id: string;
    officialId: string;
    userId: string;
    overallRating: number;
    sectorId?: string;
    sectorName?: string;
    sectorColor?: string;
    rating?: number;
    createdAt: Date;
  }>,
  sectorInfo: Array<{
    id: string;
    name: string;
    color: string;
  }>
) {
  // If no ratings, return empty data structure
  if (!ratings || ratings.length === 0) {
    return createEmptyTimeData(sectorInfo);
  }

  // Sort ratings by creation date (oldest to newest)
  const sortedRatings = [...ratings].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Generate time period ranges
  const now = new Date();

  // Last 24 hours - hourly buckets
  const dayStart = new Date(now);
  dayStart.setHours(now.getHours() - 24);

  // Last 7 days - daily buckets
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 6); // Last 7 days including today

  // Last 12 months - monthly buckets
  const yearStart = new Date(now);
  yearStart.setFullYear(now.getFullYear() - 1);

  // Last 7 years - yearly buckets
  const multiYearStart = new Date(now);
  multiYearStart.setFullYear(now.getFullYear() - 6); // Last 7 years including current

  // Generate time labels
  const dayLabels = Array.from({ length: 24 }, (_, i) => {
    const hour = (now.getHours() - 23 + i + 24) % 24;
    return `${hour}:00`;
  });

  const weekLabels = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - 6 + i);
    return `${date.toLocaleString("default", {
      month: "short",
    })} ${date.getDate()}`;
  });

  const yearLabels = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(now);
    date.setMonth(now.getMonth() - 11 + i);
    return date.toLocaleString("default", { month: "short" });
  });

  const multiYearLabels = Array.from({ length: 7 }, (_, i) => {
    return `${now.getFullYear() - 6 + i}`;
  });

  // Create data structure
  const timeData = {
    periods: {
      "1 Dy": { label: dayLabels, data: new Array(24).fill(0) },
      "1 Wk": { label: weekLabels, data: new Array(7).fill(0) },
      "1 Yr": { label: yearLabels, data: new Array(12).fill(0) },
      "This year": { label: multiYearLabels, data: new Array(7).fill(0) },
    },
    sectorData: {
      "1 Dy": {} as TimeDataBySector,
      "1 Wk": {} as TimeDataBySector,
      "1 Yr": {} as TimeDataBySector,
      "This year": {} as TimeDataBySector,
    },
  };

  // Initialize sector data structure for each time period
  sectorInfo.forEach((sector) => {
    const sectorId = sector.id;
    const sectorName = sector.name;

    // For each time period, create an entry for this sector
    timeData.sectorData["1 Dy"][sectorName] = {
      sectorId,
      color: sector.color,
      data: new Array(24).fill(0),
    };

    timeData.sectorData["1 Wk"][sectorName] = {
      sectorId,
      color: sector.color,
      data: new Array(7).fill(0),
    };

    timeData.sectorData["1 Yr"][sectorName] = {
      sectorId,
      color: sector.color,
      data: new Array(12).fill(0),
    };

    timeData.sectorData["This year"][sectorName] = {
      sectorId,
      color: sector.color,
      data: new Array(7).fill(0),
    };
  });

  // Counters for each time bucket to calculate averages
  const dayCounts = new Array(24).fill(0);
  const weekCounts = new Array(7).fill(0);
  const yearCounts = new Array(12).fill(0);
  const multiYearCounts = new Array(7).fill(0);

  // For sector data
  const sectorDayCounts: { [key: string]: number[] } = {};
  const sectorWeekCounts: { [key: string]: number[] } = {};
  const sectorYearCounts: { [key: string]: number[] } = {};
  const sectorMultiYearCounts: { [key: string]: number[] } = {};

  sectorInfo.forEach((sector) => {
    sectorDayCounts[sector.name] = new Array(24).fill(0);
    sectorWeekCounts[sector.name] = new Array(7).fill(0);
    sectorYearCounts[sector.name] = new Array(12).fill(0);
    sectorMultiYearCounts[sector.name] = new Array(7).fill(0);
  });

  // Process each rating to populate the time data
  sortedRatings.forEach((rating) => {
    const date = new Date(rating.createdAt);

    // Process overall ratings
    if (date >= dayStart) {
      // Day data - hourly
      const hourIndex = Math.floor(
        (date.getTime() - dayStart.getTime()) / (60 * 60 * 1000)
      );
      if (hourIndex >= 0 && hourIndex < 24) {
        timeData.periods["1 Dy"].data[hourIndex] += rating.overallRating;
        dayCounts[hourIndex]++;
      }
    }

    if (date >= weekStart) {
      // Week data - daily
      const dayIndex = Math.floor(
        (date.getTime() - weekStart.getTime()) / (24 * 60 * 60 * 1000)
      );
      if (dayIndex >= 0 && dayIndex < 7) {
        timeData.periods["1 Wk"].data[dayIndex] += rating.overallRating;
        weekCounts[dayIndex]++;
      }
    }

    if (date >= yearStart) {
      // Year data - monthly
      const monthDiff =
        (date.getFullYear() - yearStart.getFullYear()) * 12 +
        date.getMonth() -
        yearStart.getMonth();
      if (monthDiff >= 0 && monthDiff < 12) {
        timeData.periods["1 Yr"].data[monthDiff] += rating.overallRating;
        yearCounts[monthDiff]++;
      }
    }

    if (date >= multiYearStart) {
      // Multi-year data - yearly
      const yearDiff = date.getFullYear() - multiYearStart.getFullYear();
      if (yearDiff >= 0 && yearDiff < 7) {
        timeData.periods["This year"].data[yearDiff] += rating.overallRating;
        multiYearCounts[yearDiff]++;
      }
    }

    // Process sector-specific ratings
    if (rating.sectorId && rating.sectorName && rating.rating !== undefined) {
      const sectorName = rating.sectorName;

      // Only process if we have this sector in our metadata
      if (timeData.sectorData["1 Dy"][sectorName]) {
        if (date >= dayStart) {
          // Day data - hourly
          const hourIndex = Math.floor(
            (date.getTime() - dayStart.getTime()) / (60 * 60 * 1000)
          );
          if (hourIndex >= 0 && hourIndex < 24) {
            timeData.sectorData["1 Dy"][sectorName].data[hourIndex] +=
              rating.rating;
            sectorDayCounts[sectorName][hourIndex]++;
          }
        }

        if (date >= weekStart) {
          // Week data - daily
          const dayIndex = Math.floor(
            (date.getTime() - weekStart.getTime()) / (24 * 60 * 60 * 1000)
          );
          if (dayIndex >= 0 && dayIndex < 7) {
            timeData.sectorData["1 Wk"][sectorName].data[dayIndex] +=
              rating.rating;
            sectorWeekCounts[sectorName][dayIndex]++;
          }
        }

        if (date >= yearStart) {
          // Year data - monthly
          const monthDiff =
            (date.getFullYear() - yearStart.getFullYear()) * 12 +
            date.getMonth() -
            yearStart.getMonth();
          if (monthDiff >= 0 && monthDiff < 12) {
            timeData.sectorData["1 Yr"][sectorName].data[monthDiff] +=
              rating.rating;
            sectorYearCounts[sectorName][monthDiff]++;
          }
        }

        if (date >= multiYearStart) {
          // Multi-year data - yearly
          const yearDiff = date.getFullYear() - multiYearStart.getFullYear();
          if (yearDiff >= 0 && yearDiff < 7) {
            timeData.sectorData["This year"][sectorName].data[yearDiff] +=
              rating.rating;
            sectorMultiYearCounts[sectorName][yearDiff]++;
          }
        }
      }
    }
  });

  // Calculate averages for overall ratings
  for (let i = 0; i < 24; i++) {
    timeData.periods["1 Dy"].data[i] =
      dayCounts[i] > 0
        ? Math.round(timeData.periods["1 Dy"].data[i] / dayCounts[i])
        : i > 0
        ? timeData.periods["1 Dy"].data[i - 1]
        : 0; // Use previous value if no data
  }

  for (let i = 0; i < 7; i++) {
    timeData.periods["1 Wk"].data[i] =
      weekCounts[i] > 0
        ? Math.round(timeData.periods["1 Wk"].data[i] / weekCounts[i])
        : i > 0
        ? timeData.periods["1 Wk"].data[i - 1]
        : 0;
  }

  for (let i = 0; i < 12; i++) {
    timeData.periods["1 Yr"].data[i] =
      yearCounts[i] > 0
        ? Math.round(timeData.periods["1 Yr"].data[i] / yearCounts[i])
        : i > 0
        ? timeData.periods["1 Yr"].data[i - 1]
        : 0;
  }

  for (let i = 0; i < 7; i++) {
    timeData.periods["This year"].data[i] =
      multiYearCounts[i] > 0
        ? Math.round(timeData.periods["This year"].data[i] / multiYearCounts[i])
        : i > 0
        ? timeData.periods["This year"].data[i - 1]
        : 0;
  }

  // Calculate averages for sector ratings
  sectorInfo.forEach((sector) => {
    const sectorName = sector.name;

    // Only process sectors that exist in our data structure
    if (timeData.sectorData["1 Dy"][sectorName]) {
      for (let i = 0; i < 24; i++) {
        timeData.sectorData["1 Dy"][sectorName].data[i] =
          sectorDayCounts[sectorName][i] > 0
            ? Math.round(
                timeData.sectorData["1 Dy"][sectorName].data[i] /
                  sectorDayCounts[sectorName][i]
              )
            : i > 0
            ? timeData.sectorData["1 Dy"][sectorName].data[i - 1]
            : 0;
      }

      for (let i = 0; i < 7; i++) {
        timeData.sectorData["1 Wk"][sectorName].data[i] =
          sectorWeekCounts[sectorName][i] > 0
            ? Math.round(
                timeData.sectorData["1 Wk"][sectorName].data[i] /
                  sectorWeekCounts[sectorName][i]
              )
            : i > 0
            ? timeData.sectorData["1 Wk"][sectorName].data[i - 1]
            : 0;
      }

      for (let i = 0; i < 12; i++) {
        timeData.sectorData["1 Yr"][sectorName].data[i] =
          sectorYearCounts[sectorName][i] > 0
            ? Math.round(
                timeData.sectorData["1 Yr"][sectorName].data[i] /
                  sectorYearCounts[sectorName][i]
              )
            : i > 0
            ? timeData.sectorData["1 Yr"][sectorName].data[i - 1]
            : 0;
      }

      for (let i = 0; i < 7; i++) {
        timeData.sectorData["This year"][sectorName].data[i] =
          sectorMultiYearCounts[sectorName][i] > 0
            ? Math.round(
                timeData.sectorData["This year"][sectorName].data[i] /
                  sectorMultiYearCounts[sectorName][i]
              )
            : i > 0
            ? timeData.sectorData["This year"][sectorName].data[i - 1]
            : 0;
      }
    }
  });

  // Fill in gaps using forward-filling
  fillDataGaps(timeData.periods["1 Dy"].data);
  fillDataGaps(timeData.periods["1 Wk"].data);
  fillDataGaps(timeData.periods["1 Yr"].data);
  fillDataGaps(timeData.periods["This year"].data);

  // Fill sector data gaps
  sectorInfo.forEach((sector) => {
    const sectorName = sector.name;
    if (timeData.sectorData["1 Dy"][sectorName]) {
      fillDataGaps(timeData.sectorData["1 Dy"][sectorName].data);
      fillDataGaps(timeData.sectorData["1 Wk"][sectorName].data);
      fillDataGaps(timeData.sectorData["1 Yr"][sectorName].data);
      fillDataGaps(timeData.sectorData["This year"][sectorName].data);
    }
  });

  return timeData;
}

/**
 * Fill any gaps in the data array with the last known value
 * @param data The data array to fill gaps in
 */
function fillDataGaps(data: number[]) {
  let lastValue = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i] === 0 && i > 0) {
      data[i] = lastValue;
    } else if (data[i] > 0) {
      lastValue = data[i];
    }
  }
}

/**
 * Create an empty time data structure when no ratings are available
 */
function createEmptyTimeData(
  sectorInfo: Array<{ id: string; name: string; color: string }>
) {
  const dayLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  const weekLabels = (() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(
        `${date.toLocaleString("default", {
          month: "short",
        })} ${date.getDate()}`
      );
    }
    return days;
  })();

  const monthLabels = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const yearLabels = (() => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = 6; i >= 0; i--) {
      years.push(`${currentYear - i}`);
    }
    return years;
  })();

  // Default value for empty data
  const defaultValue = 0;

  const timeData = {
    periods: {
      "1 Dy": { label: dayLabels, data: new Array(24).fill(defaultValue) },
      "1 Wk": { label: weekLabels, data: new Array(7).fill(defaultValue) },
      "1 Yr": { label: monthLabels, data: new Array(12).fill(defaultValue) },
      "This year": { label: yearLabels, data: new Array(7).fill(defaultValue) },
    },
    sectorData: {
      "1 Dy": {} as TimeDataBySector,
      "1 Wk": {} as TimeDataBySector,
      "1 Yr": {} as TimeDataBySector,
      "This year": {} as TimeDataBySector,
    },
  };

  // Initialize empty sector data
  sectorInfo.forEach((sector) => {
    const sectorId = sector.id;
    const sectorName = sector.name;

    // For each time period, create an entry for this sector
    timeData.sectorData["1 Dy"][sectorName] = {
      sectorId,
      color: sector.color,
      data: new Array(24).fill(defaultValue),
    };

    timeData.sectorData["1 Wk"][sectorName] = {
      sectorId,
      color: sector.color,
      data: new Array(7).fill(defaultValue),
    };

    timeData.sectorData["1 Yr"][sectorName] = {
      sectorId,
      color: sector.color,
      data: new Array(12).fill(defaultValue),
    };

    timeData.sectorData["This year"][sectorName] = {
      sectorId,
      color: sector.color,
      data: new Array(7).fill(defaultValue),
    };
  });

  return timeData;
}
