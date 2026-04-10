export function calcDuration(
  startDate: string,
  current: boolean,
  endDate?: string,
): string {
  const [sy, sm] = startDate.split("-").map(Number);
  const start = new Date(sy, sm - 1);
  const end = current
    ? new Date()
    : (() => {
        const [ey, em] = endDate!.split("-").map(Number);
        return new Date(ey, em, 0);
      })();

  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth()) +
    1;

  const years = Math.floor(months / 12);
  const rem = months % 12;

  if (years === 0) return `${rem} mese${rem === 1 ? "" : "s"}`;
  if (rem === 0) return `${years} año${years > 1 ? "s" : ""}`;
  return `${years} año${years > 1 ? "s" : ""} ${rem} mes${rem === 1 ? "" : "es"}`;
}
