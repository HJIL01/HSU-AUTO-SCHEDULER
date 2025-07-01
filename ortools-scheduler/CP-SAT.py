import json

from ortools.sat.python import cp_model
from collections import defaultdict
from constraints import add_max_credit_constraint, set_objective_max_credit

CONSTRAINTS = {
    "major": "V024",
    "grade": 3,
    "day_or_night": "night",
    "no_class_days": ["Mon", "Fri"],
    "personal_schedule": [
        {"schedule_name": "알바1", "day": "Tue", "startTime": 540, "endTime": 660},
        {"schedule_name": "알바2", "day": "Fri", "startTime": 1080, "endTime": 1350},
    ],
    "max_credit": 18,
    "major_foundation": 0,
    "major_required": 6,
    "major_elective": 9,
    "daily_lecture_limit": 3,
}

with open("../courses.json", encoding="utf-8") as f:
    courses = json.load(f)


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
        if cor["dayOrNight"] == CONSTRAINTS["day_or_night"]
        or cor["dayOrNight"] == "both"
    ]

    # print(len(filtered_by_day_or_night))
    # print(filtered_by_day_or_night)

    return filtered_by_day_or_night


def HSU_AUTO_SCHEDULER_CP_SAT():
    # 최종 필터링된 데이터임
    filtered_courses = debugFilter()
    data_len = len(filtered_courses)

    model = cp_model.CpModel()
    selected = [model.NewBoolVar(f"select_{i}") for i in range(data_len)]

    add_max_credit_constraint(
        filtered_courses, model, selected, CONSTRAINTS["max_credit"]
    )
    add_deduplicated_course_constraint(filtered_courses, model, selected)
    set_objective_max_credit(filtered_courses, model, selected)

    solver = cp_model.CpSolver()
    status = solver.solve(model)

    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        print("선택된 과목:")
        total_credit = 0
        for i in range(data_len):
            if solver.Value(selected[i]):
                print(
                    f"- {filtered_courses[i]['courseName']} ({filtered_courses[i]['credit']}학점)"
                )
                total_credit += filtered_courses[i]["credit"]
        print(f"총 학점: {total_credit}")
    else:
        print("해를 찾을 수 없습니다.")


def add_deduplicated_course_constraint(courses, model, selected):
    course_name_to_indices = defaultdict(list)

    for idx, course in enumerate(courses):
        course_name_to_indices[course["courseName"]].append(idx)

    # 제약 추가: 같은 과목 이름은 하나만 선택 가능
    for indices in course_name_to_indices.values():
        model.Add(sum(selected[i] for i in indices) <= 1)


HSU_AUTO_SCHEDULER_CP_SAT()
