const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
});

const MS_PER_DAY = 86_400_000;
const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export function formatPickupWindow({
  start,
  end,
}: {
  start: string;
  end: string;
}) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const extraDays = Math.round(
    (startOfDay(endDate).getTime() - startOfDay(startDate).getTime()) /
      MS_PER_DAY,
  );
  const suffix =
    extraDays <= 0
      ? ""
      : extraDays === 1
        ? " (+1 dia)"
        : ` (+${extraDays} dias)`;

  return {
    day: dateFormatter.format(startDate),
    range: `${timeFormatter.format(startDate)} – ${timeFormatter.format(endDate)}${suffix}`,
    endsOn: extraDays > 0 ? dateFormatter.format(endDate) : null,
  };
}
