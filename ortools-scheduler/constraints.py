from collections import defaultdict
from utils.get_start_time_and_end_time import get_start_time_and_end_time
from utils.sort_by_start_time import sort_by_start_time


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


# 최대 학점 제한하는 제약조건 추가 함수
def add_max_credit_constraint(courses, model, selected, max_credit: int):
    # 최대 학점 제한
    limit_max = (
        sum(course["credit"] * cur for course, cur in zip(courses, selected))
        == max_credit
    )

    # 최소 학점 제한 최대 학점에서 6뺀 학점. 최대 학점이 6미만이라면 0으로 처리
    min_credit = max_credit - 6 if max_credit - 6 > 0 else 0
    # limit_min = (
    #     sum(course["credit"] * cur for course, cur in zip(courses, selected))
    #     >= min_credit
    # )

    model.Add(limit_max)
    # model.Add(limit_min)


# 과목의 이름을 기준으로 중복을 제거하는 제약조건 추가 함수
def add_deduplicated_course_constraint(courses, model, selected):
    course_name_to_indices = defaultdict(list)

    # 동일한 과목들을 전체 배열에서 인덱스를 기준으로 각기 배열로 묶은 dict를 생성
    # 해당 배열들을 돌면서 selected 배열에서 그 배열의 selected의 합이 1이 넘지 않도록 제약조건 추가
    # [1, 2, 3, 4]로 묶였다면 selected에서 해당 인덱스들의 합은 반드시 1 이하여야 함
    for idx, course in enumerate(courses):
        course_name_to_indices[course["courseName"]].append(idx)

    for indices in course_name_to_indices.values():
        model.Add(sum(selected[i] for i in indices) <= 1)


# 사용자가 입력한 전공 기초 학점의 최솟값만큼 해에 전공 기초를 보장 제약조건 추가 함수
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


# 사용자가 입력한 전공 필수 학점의 최솟값만큼 해에 전공 필수를 보장 제약조건 추가 함수
def add_major_required_min_constraint(courses, model, selected, major_required_credit):
    model.Add(
        sum(
            course["credit"] * cur
            for course, cur in zip(courses, selected)
            if course["completionType"] == "전필"
        )
        >= major_required_credit
    )


# 사용자가 입력한 전공 선택 학점의 최솟값만큼 해에 전공 선택를 보장 제약조건 추가 함수
def add_major_elective_min_constraint(courses, model, selected, major_elective_credit):
    model.Add(
        sum(
            course["credit"] * cur
            for course, cur in zip(courses, selected)
            if course["completionType"] == "전선"
        )
        >= major_elective_credit
    )


# 하루 최대 강의수를 제한하는 제약조건 추가 함수
def add_daily_lecture_limit_constraint(courses, model, selected, daily_lecture_limit):
    course_day_indices = defaultdict(list)

    for idx, course in enumerate(courses):
        sessionInfo = course["sessionInfo"]
        if sessionInfo.get("offline"):
            for offlineSession in sessionInfo["offline"]:
                course_day_indices[offlineSession["day"]].append(idx)

    for indices in course_day_indices.values():
        model.Add(sum(selected[i] for i in indices) <= daily_lecture_limit)
        # 이 밑에는 선택된 요일들에 최소 하나씩은 강의를 배치해야 한다는 조건임. 나중에 시간표가 이상하다면 주석 풀기
        # model.Add(sum(selected[i] for i in indices) >= 1)


# 연강을 지향할 제약조건 추가 함수
def add_class_gap_constraint(courses, model, is_selected, allowed_gap_minutes):
    course_day_indices = defaultdict(list)

    for idx, course in enumerate(courses):
        session_info = course["sessionInfo"]
        if session_info.get("offline"):
            for offlineSession in session_info["offline"]:
                course_day_indices[offlineSession["day"]].append(idx)

    # 시작 시간 기준으로 sort를 하기 때문에 course_day_indices의 요일마다의 인덱스 배열은 항상 시작 시간 기준의 단방향임
    # 요일마다 강의를 돌고, 해당 요일의 모든 시작 시간, 끝나는 시간을 해당 요일의 다른 모든 강좌들과 비교한다
    # 시간이 겹치거나, 현재 강의와 비교하는 강의(다음 강의)와의 gap이 n분 이상 차이가 나면 연강이 아니라고 판단한다
    # 위의 조건에 해당한다면 .Not()을 통해 둘 중 하나는 무조건 함께 선택되지 않아야 한다는 제약조건을 걸어둠

    # O(n^2)는 필수적, 다만 next()로 해당 요일과 같은 요일의 오프라인 세션을 찾기 때문에 한 강의가 같은 요일에 해당하는 오프라인 세션이 두 개 이상이라면 문제가 있음
    # !!!!한 강의가 같은 요일에 수업이 두 번 이상 있지는 않다는 것을 전제한 로직!!!! 두 번 이상 있는 강의가 있다면 배열 형태로 도는 방식으로 수정해야함
    for day in course_day_indices:
        # 월화수목금토일 각기 다른 dict에 담긴 인덱스들
        indices_by_day = course_day_indices[day]

        # 시작 시간 기준으로 오름차순 정렬
        indices_by_day.sort(
            key=lambda course_index: sort_by_start_time(courses, course_index, day)
        )
        for i, cur_index in enumerate(indices_by_day):
            cur_course = courses[cur_index]
            # 현재 강좌의 오프라인 세션 정보 중 현재 돌고 있는 반복문과 같은 요일의 강의 장소 정보를 찾음
            _, cur_end_time = get_start_time_and_end_time(cur_course, day)
            # print(cur_start_time, cur_end_time)

            for j in range(i + 1, len(indices_by_day)):
                next_index = indices_by_day[j]
                next_course = courses[next_index]
                next_start_time, _ = get_start_time_and_end_time(next_course, day)

                # 다음 강의의 시작 시간이 현재 강의의 끝나는 시간보다 빠르거나(시간이 겹친다면) 강의 사이의 공강 시간이 선호 공강 시간보다 크다면
                if (
                    next_start_time < cur_end_time
                    or (next_start_time - cur_end_time) > allowed_gap_minutes
                ):
                    model.AddBoolOr(
                        [is_selected[cur_index].Not(), is_selected[next_index].Not()]
                    )
