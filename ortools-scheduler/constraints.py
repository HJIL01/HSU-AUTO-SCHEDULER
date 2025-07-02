from collections import defaultdict


# 최대로 지향하는 목적 함수
# 목적 함수는 모델에서 하나만 사용 가능하다
def set_objective_maximize_credit(courses, model, selected):
    # 최대 학점 지향하는 목적식
    # 이게 없다면 0학점도 나올 수 있음
    objective_max_credit = sum(
        cur * course["credit"] for cur, course in zip(selected, courses)
    )

    # 전공 기초 선택을 최소화하는 목적식
    # 전공 기초는 최소 사용자가 입력한 값 이상을 선택하기 때문에 최대를 제한하기 위해 가중치를 조절하여 최소한의 선택을 하도록 한다
    objective_minimize_major_foundation = sum(
        course["credit"] * cur
        for course, cur in zip(courses, selected)
        if course["completionType"] == "전기"
    )

    # 전공 필수 선택을 최소화하는 목적식
    # 전공 필수 또한 전공 기초와 마찬가지로 입력한 값 이상을 선택하되, 최대를 제한하기 위해 가중치를 조절
    objective_minimize_major_required = sum(
        course["credit"] * cur
        for course, cur in zip(courses, selected)
        if course["completionType"] == "전필"
    )

    # 전공 선택 선택을 최소화하는 목적식
    # 전공 선택 또한 전공 기초와 마찬가지로 입력한 값 이상을 선택하되, 최대를 제한하기 위해 가중치를 조절
    objective_minimize_major_elective = sum(
        course["credit"] * cur
        for course, cur in zip(courses, selected)
        if course["completionType"] == "전선"
    )

    model.Maximize(
        objective_max_credit
        - objective_minimize_major_foundation * 0.5
        - objective_minimize_major_required * 0.5
        - objective_minimize_major_elective * 0.5
    )


# 최대 학점 제한하는 제약조건 함수
def add_max_credit_constraint(courses, model, selected, max_credit: int):
    model.Add(
        sum(cur * course["credit"] for cur, course in zip(selected, courses))
        <= max_credit
    )


# 과목의 이름을 기준으로 중복을 제거하는 제약함수
def add_deduplicated_course_constraint(courses, model, selected):
    course_name_to_indices = defaultdict(list)

    # 동일한 과목들을 전체 배열에서 인덱스를 기준으로 각기 배열로 묶은 dict를 생성
    # 해당 배열들을 돌면서 selected 배열에서 그 배열의 selected의 합이 1이 넘지 않도록 제약조건 추가
    # [1, 2, 3, 4]로 묶였다면 selected에서 해당 인덱스들의 합은 반드시 1 이하여야 함
    for idx, course in enumerate(courses):
        course_name_to_indices[course["courseName"]].append(idx)

    for indices in course_name_to_indices.values():
        model.Add(sum(selected[i] for i in indices) <= 1)


# 사용자가 입력한 전공 기초 학점의 최솟값만큼 해에 전공 기초를 보장 제약 조건 추가 함수
def add_major_foundation_min_constraint(
    courses, model, selected, major_foundation_credit
):
    model.Add(
        sum(
            course["credit"] * cur
            for course, cur in zip(courses, selected)
            if course["completionType"] == "전기"
        )
        >= major_foundation_credit
    )


# 사용자가 입력한 전공 필수 학점의 최솟값만큼 해에 전공 필수를 보장 제약 조건 추가 함수
def add_major_required_min_constraint(courses, model, selected, major_required_credit):
    model.Add(
        sum(
            course["credit"] * cur
            for course, cur in zip(courses, selected)
            if course["completionType"] == "전필"
        )
        >= major_required_credit
    )


# 사용자가 입력한 전공 선택 학점의 최솟값만큼 해에 전공 선택를 보장 제약 조건 추가 함수
def add_major_elective_min_constaraint(courses, model, selected, major_elective_credit):
    model.Add(
        sum(
            course["credit"] * cur
            for course, cur in zip(courses, selected)
            if course["completionType"]
        )
        >= major_elective_credit
    )
