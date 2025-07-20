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

export const WeekdayOrder: Record<WeekdayEnum, number> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};
