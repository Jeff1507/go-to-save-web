export const formatTimeRange = (start: string, end: string) => {
  const from = start;
  const to = end;
  return `${from} – ${to}${to <= from ? " (+1 dia)" : ""}`;
};
