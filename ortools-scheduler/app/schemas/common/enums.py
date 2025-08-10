from enum import Enum


class WeekdayEnum(str, Enum):
    MON = "Mon"
    TUE = "Tue"
    WED = "Wed"
    THU = "Thu"
    FRI = "Fri"
    SAT = "Sat"
    SUN = "Sun"
    NONE = "nontimes"


class DayOrNightEnum(str, Enum):
    DAY = "day"
    NIGHT = "night"
    BOTH = "both"
