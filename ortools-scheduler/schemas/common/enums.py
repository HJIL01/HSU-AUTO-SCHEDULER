from enum import Enum


class WeekdayEnum(str, Enum):
    MON = "Mon"
    TUE = "Tue"
    WED = "Wed"
    THU = "Thu"
    FRI = "Fri"
    SAT = "Sat"
    SUN = "Sun"


class DayOrNightEnum(str, Enum):
    DAY = "day"
    NIGHT = "night"
    BOTH = "both"
