from collections import defaultdict
from typing import Union
from app.schemas.common.course_schema import CourseSchema
from app.schemas.common.enums import WeekdayEnum


def group_courses_by_day(courses: list[CourseSchema]):
    courses_by_day: defaultdict[Union[WeekdayEnum, str], list[CourseSchema]] = (
        defaultdict(list)
    )

    for course in courses:
        if len(course.offline_schedules) == 0:
            courses_by_day["nontimes"].append(course)
        else:
            for offline_schedule in course.offline_schedules:
                day = offline_schedule.day
                courses_by_day[day].append(course)

    return courses_by_day
