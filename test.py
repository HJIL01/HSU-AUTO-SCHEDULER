from collections import defaultdict
from enum import Enum


class WeekdayEnum(str, Enum):
    MON = "Mon"
    TUE = "Tue"
    WED = "Wed"
    THU = "Thu"
    FRI = "Fri"
    SAT = "Sat"
    SUN = "Sun"


test = [
    {"day": WeekdayEnum.FRI, "name": "test1"},
    {"day": WeekdayEnum.MON, "name": "test2"},
    {"day": WeekdayEnum.MON, "name": "test3"},
    {"day": WeekdayEnum.TUE, "name": "test4"},
    {"day": WeekdayEnum.WED, "name": "test5"},
    {"day": WeekdayEnum.MON, "name": "test6"},
]

group = defaultdict(list)

for t in test:
    group[t["day"]].append(t)

# WeekdayEnum 값을 리스트로 추출 (순서 유지)
all_days_list = [item for item in WeekdayEnum]

# group에 있는 요일 집합 (키는 문자열)
group_days = set(group)

# 순서 유지하며 외집합 배열 구하기
outside_days_list = [day.name for day in all_days_list if day not in group_days]

print(outside_days_list)
