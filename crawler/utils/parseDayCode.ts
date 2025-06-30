const days = {
  월: "Mon",
  화: "Tue",
  수: "Wed",
  목: "Thu",
  금: "Fri",
  토: "Sat",
  일: "Sun",
};

export function parseDays(day: string) {
  return days[day];
}
