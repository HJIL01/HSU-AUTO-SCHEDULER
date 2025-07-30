import json
from ..utils.group_courses_by_day import group_courses_by_day


with open("../courses.json", encoding="utf-8") as f:
    courses = json.load(f)


test = group_courses_by_day(courses)

print(test)
