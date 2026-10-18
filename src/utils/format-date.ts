export function formatDate(date: Date) {
  return new Date(date).toLocaleString("pt-BR", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
