from collections import defaultdict
from typing import Union
from app.schemas.common.enums import WeekdayEnum
from app.utils.get_start_time_and_end_time import get_start_time_and_end_time
from app.utils.sort_by_start_time import sort_by_start_time


def get_total_course_gap(courses_by_day: defaultdict[Union[WeekdayEnum, str]]):
    total_course_gap = 0

    # 요일별로 start_time 기준 정렬
    for day in courses_by_day:
        if day == "nontimes":
            continue
        courses_by_day[day].sort(key=lambda course: sort_by_start_time(course, day))

    for day in courses_by_day:
        if day == "nontimes":
            continue
        courses_in_cur_day = courses_by_day[day]
        for i in range(len(courses_in_cur_day) - 1):
            cur_course = courses_in_cur_day[i]
            next_course = courses_in_cur_day[i + 1]

            _, cur_course_end_time_in_cur_day = get_start_time_and_end_time(
                cur_course, day
            )
            next_course_start_time_in_cur_day, __ = get_start_time_and_end_time(
                next_course, day
            )

            total_course_gap += (
                next_course_start_time_in_cur_day - cur_course_end_time_in_cur_day
            )

    return total_course_gap
