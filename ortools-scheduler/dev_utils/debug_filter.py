from .mock_courses import courses
from .CONSTRAINTS import CONSTRAINTS


def debugFilter():
    # 어차피 전공은 필터링되었다고 치고

    # 학년 필터링
    filtered_by_grade = [
        course
        for course in courses
        if course["grade"] == CONSTRAINTS["grade"] or course["grade"] == "전학년"
    ]

    # print(len(filtered_by_grade))
    # print(filtered_by_grade)

    # 주야 필터링
    filtered_by_day_or_night = [
        cor
        for cor in filtered_by_grade
        if cor["day_or_night"] == CONSTRAINTS["day_or_night"]
        or cor["day_or_night"] == "both"
    ]

    # print(len(filtered_by_day_or_night))
    # print(filtered_by_day_or_night)

    return filtered_by_day_or_night
