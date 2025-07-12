import json

from ortools.sat.python import cp_model
from constraints import (
    # set_objective_maximize_credit,
    add_max_credit_constraint,
    add_deduplicated_course_constraint,
    add_major_foundation_min_constraint,
    add_major_required_min_constraint,
    add_major_elective_min_constraint,
    add_daily_lecture_limit_constraint,
    add_class_gap_constraint,
)
from solution_collector import AllSolutionCollector

CONSTRAINTS = {
    "major": "V024",
    "grade": 3,
    "day_or_night": "night",
    "no_class_days": [
        "Mon",
        "Fri",
    ],
    "personal_schedule": [
        {"schedule_name": "알바1", "day": "Tue", "startTime": 540, "endTime": 660},
        {"schedule_name": "알바2", "day": "Fri", "startTime": 1080, "endTime": 1350},
    ],
    "max_credit": 18,
    "major_foundation": 0,
    "major_required": 0,
    "major_elective": 9,
    "daily_lecture_limit": 2,
    "allowed_gap_mins": 0,
    "has_lunch_break": True,
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
    # 현재 필터링은 그냥 학년과 주야로만 했음
    filtered_courses = debugFilter()
    data_len = len(filtered_courses)

    model = cp_model.CpModel()

    is_selected = [model.NewBoolVar(f"course{i}_is_selected") for i in range(data_len)]

    # set_objective_maximize_credit(filtered_courses, model, is_selected)

    add_max_credit_constraint(
        filtered_courses, model, is_selected, CONSTRAINTS["max_credit"]
    )
    add_deduplicated_course_constraint(filtered_courses, model, is_selected)
    add_major_foundation_min_constraint(
        filtered_courses, model, is_selected, CONSTRAINTS["major_foundation"]
    )
    add_major_required_min_constraint(
        filtered_courses, model, is_selected, CONSTRAINTS["major_required"]
    )
    add_major_elective_min_constraint(
        filtered_courses, model, is_selected, CONSTRAINTS["major_elective"]
    )
    add_daily_lecture_limit_constraint(
        filtered_courses, model, is_selected, CONSTRAINTS["daily_lecture_limit"]
    )
    add_class_gap_constraint(
        filtered_courses, model, is_selected, CONSTRAINTS["allowed_gap_minutes"]
    )

    solver = cp_model.CpSolver()
    solution_collector = AllSolutionCollector(is_selected, filtered_courses)

    # Enumerate all solutions.
    solver.parameters.enumerate_all_solutions = True

    # Solve
    status = solver.solve(model, solution_collector)

    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        solution_collector.solution_print()


HSU_AUTO_SCHEDULER_CP_SAT()
