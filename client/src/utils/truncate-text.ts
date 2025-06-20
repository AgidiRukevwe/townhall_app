export function truncateText(text: string, limit: number): string {
  if (!text) return "";
  return text.length > limit ? text.slice(0, limit) + "…" : text;
}
