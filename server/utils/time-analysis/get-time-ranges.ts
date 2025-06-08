function getTimeRanges(now: Date) {
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
