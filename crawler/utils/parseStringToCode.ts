import { DayOrNightEnum } from "types/dayOrNight.enum";
import { WeekdayEnum } from "types/weekday.enum";

// 요일을 요일 코드로 변환하는 함수
export function parseDays(day: string): WeekdayEnum {
  const days: Record<string, WeekdayEnum> = {
    월: WeekdayEnum.MON,
    화: WeekdayEnum.TUE,
    수: WeekdayEnum.WED,
    목: WeekdayEnum.THU,
    금: WeekdayEnum.FRI,
    토: WeekdayEnum.SAT,
    일: WeekdayEnum.SUN,
  };

  return days[day];
}

// 주간 야간을 DayOrNightEnum 코드로 변환하는 함수
export function parseDayOrNight(koreanCode: string): DayOrNightEnum {
  const map: Record<string, DayOrNightEnum> = {
    주: DayOrNightEnum.DAY,
    야: DayOrNightEnum.NIGHT,
    합: DayOrNightEnum.BOTH,
  };

  return map[koreanCode];
}
