import json

from ortools.sat.python import cp_model

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


debugFilter()


def simple_sat_program():
    """Minimal CP-SAT example to showcase calling the solver."""
    # Creates the model.
    model = cp_model.CpModel()

    # Creates the variables.
    num_vals = 3
    x1 = model.new_int_var(0, num_vals - 1, "x")
    y = model.new_int_var(0, num_vals - 1, "y")
    z = model.new_int_var(0, num_vals - 1, "z")

    # Creates the constraints.
    model.add(x1 != y)

    # Creates a solver and solves the model.
    solver = cp_model.CpSolver()
    status = solver.solve(model)

    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        print(f"x = {solver.value(x1)}")
        print(f"y = {solver.value(y)}")
        print(f"z = {solver.value(z)}")
    else:
        print("No solution found.")
