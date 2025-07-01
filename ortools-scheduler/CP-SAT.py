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

    return filtered_by_day_or_night


def HSU_AUTO_SCHEDULER_CP_SAT():
    # 최종 데이터임
    data = debugFilter()
    data_len = len(data)

    model = cp_model.CpModel()
    selected = [model.NewBoolVar(f"select_{i}") for i in range(data_len)]

    add_max_credit_constraint(
        data, data_len, model, selected, CONSTRAINTS["max_credit"]
    )

    solver = cp_model.CpSolver()
    status = solver.solve(model)

    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        print("선택된 과목:")
        total_credit = 0
        for i in range(data_len):
            if solver.Value(selected[i]):
                print(f"- {data[i]['courseName']} ({data[i]['credit']}학점)")
                total_credit += data[i]["credit"]
        print(f"총 학점: {total_credit}")
    else:
        print("해를 찾을 수 없습니다.")


def add_max_credit_constraint(data, data_len, model, selected, max_credit: int):
    model.add(
        sum(selected[i] * data[i]["credit"] for i in range(data_len)) == max_credit
    )


HSU_AUTO_SCHEDULER_CP_SAT()
