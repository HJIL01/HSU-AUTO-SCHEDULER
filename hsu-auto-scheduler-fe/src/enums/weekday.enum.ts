export enum WeekdayEnum {
  MON = "Mon",
  TUE = "Tue",
  WED = "Wed",
  THU = "Thu",
  FRI = "Fri",
  SAT = "Sat",
  SUN = "Sun",
}

export const WeekdayKorMap: Record<WeekdayEnum, string> = {
  [WeekdayEnum.MON]: "월",
  [WeekdayEnum.TUE]: "화",
  [WeekdayEnum.WED]: "수",
  [WeekdayEnum.THU]: "목",
  [WeekdayEnum.FRI]: "금",
  [WeekdayEnum.SAT]: "토",
  [WeekdayEnum.SUN]: "일",
};
