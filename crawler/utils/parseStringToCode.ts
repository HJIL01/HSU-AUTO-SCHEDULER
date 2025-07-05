// 요일을 요일 코드로 변환하는 함수
export function parseDays(day: string): string {
  const days: Record<string, string> = {
    월: "Mon",
    화: "Tue",
    수: "Wed",
    목: "Thu",
    금: "Fri",
    토: "Sat",
    일: "Sun",
  };

  return days[day];
}

// 주간 야간을 주야 코드로 변환하는 함수
export function parseDayOrNight(dayOrNight: string): string {
  const dayOrNightCode: Record<string, string> = {
    주: "day",
    야: "night",
    합: "both",
  };

  return dayOrNightCode[dayOrNight];
}
