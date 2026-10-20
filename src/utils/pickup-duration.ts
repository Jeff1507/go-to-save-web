export const MIN_PICKUP_MINUTES = 30;
export const MAX_PICKUP_MINUTES = 6 * 60;

export const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export function durationMinutes(start: string, end: string) {
  const diff = (timeToMinutes(end) - timeToMinutes(start) + 1440) % 1440;
  return diff === 0 ? 1440 : diff;
}

export function isValidPickupDuration(start: string, end: string) {
  const minutes = durationMinutes(start, end);
  return minutes >= MIN_PICKUP_MINUTES && minutes <= MAX_PICKUP_MINUTES;
}

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (hours === 0) return `${rest} min`;
  if (rest === 0) return `${hours} h`;
  return `${hours} h ${rest} min`;
}
