from collections import defaultdict
from typing import Union
from app.schemas.common.course_schema import CourseSchema
from app.schemas.common.enums import WeekdayEnum


def get_no_class_days(
    courses_by_day: defaultdict[Union[WeekdayEnum, str], list[CourseSchema]],
):
    all_days_list = [day for day in WeekdayEnum]

    group_days = set(courses_by_day)

    no_class_days_list = [
        day for day in all_days_list if day not in group_days and day.name != "NONE"
    ]

    return no_class_days_list
