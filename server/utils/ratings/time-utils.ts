export function generateTimeRanges(now = new Date()) {
  const dayStart = new Date(now);
  dayStart.setHours(now.getHours() - 24);

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 6);

  const yearStart = new Date(now);
  yearStart.setFullYear(now.getFullYear() - 1);

  const multiYearStart = new Date(now);
  multiYearStart.setFullYear(now.getFullYear() - 6);

  return { dayStart, weekStart, yearStart, multiYearStart };
}

export function generateDayLabels(now = new Date()) {
  return Array.from({ length: 24 }, (_, i) => {
    const hour = (now.getHours() - 23 + i + 24) % 24;
    return `${hour}:00`;
  });
}

export function generateWeekLabels(now = new Date()) {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now);
    date.setDate(now.getDate() - 6 + i);
    return `${date.toLocaleString("default", {
      month: "short",
    })} ${date.getDate()}`;
  });
}

export function generateMonthLabels(now = new Date()) {
  return Array.from({ length: 12 }, (_, i) => {
    const date = new Date(now);
    date.setMonth(now.getMonth() - 11 + i);
    return date.toLocaleString("default", { month: "short" });
  });
}

export function generateYearLabels(now = new Date()) {
  return Array.from({ length: 7 }, (_, i) => `${now.getFullYear() - 6 + i}`);
}
