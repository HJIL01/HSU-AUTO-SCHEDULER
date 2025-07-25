export function formatMinToHour(time: number) {
  const hour = time / 60;
  const min = time % 60;

  const paddedHour = String(Math.floor(hour)).padStart(2, "0");
  const paddedMin = String(min).padStart(2, "0");

  return `${paddedHour}:${paddedMin}`;
}
