from ortools.sat.python import cp_model
from collections import defaultdict
from .sort_by_start_time import sort_by_start_time
from .get_start_time_and_end_time import get_start_time_and_end_time
from schemas.common.course_schema import CourseSchema
from schemas.common.enums import WeekdayEnum


class AllSolutionCollector(cp_model.CpSolverSolutionCallback):
    def __init__(self, is_selected, courses: list[CourseSchema]):
        # 부모 클래스 CpSolverSolutionCallback 먼저 생성
        super().__init__()
        self.courses: list[CourseSchema] = courses
        self.is_selected = is_selected  # BoolVar 리스트
        self.selected_courses: list[CourseSchema] = (
            courses  # 제약조건들을 만족하는 강의 리스트
        )
        self.solution_count = 0  # 해 개수 카운터
        self.solutions = (
            []
        )  # 모든 솔루션들을 담은 배열 (몇번째 해인지, 선택된 인덱스, 총 학점)
        # 최대 해 개수
        self.solution_limit = 10000

    # 해를 찾을 때마다 부모 클래스인 CpSolverSolutionCallback에서 콜백할 함수
    def on_solution_callback(self):
        self.solution_count += 1

        # 현재 해에 포함된 강의들의 인덱스
        selected_indices = [
            i for i, var in enumerate(self.is_selected) if self.Value(var)
        ]

        # 현재 해에 포함된 강의들
        selected_courses = [
            self.courses[course_index] for course_index in selected_indices
        ]

        # 현재 해의 총 학점 합
        total_credit = sum(
            selected_course.credit for selected_course in selected_courses
        )

        total_online_course_count = sum(
            1
            for selected_course in selected_courses
            if selected_course.delivery_method == "온라인100%"
        )

        # 1. 요일별로 묶은 후 start_time 기준으로 정렬한다
        # 2. 정렬 후엔 요일별 시간 순으로 강의가 배치되어 있으므로
        # 3. 다음 강의의 시작 시간 - 현재 강의의 끝나는 시간을 gap에 모두 더하여 total_gap을 구한다
        courses_by_day = defaultdict(list)
        total_course_gap = 0

        # 공강인 요일까지도 전부 포함해서 묶기(요일에 배치된 강의가 없으면 빈 배열)
        for day in WeekdayEnum:
            courses_by_day[day.value] = []

        # 요일별로 묶기
        for selected_course in selected_courses:
            selected_course_offline_schedules = selected_course.offline_schedules
            if len(selected_course_offline_schedules) > 0:
                for cur_offline_schedule in selected_course_offline_schedules:
                    cur_offline_schedule_day = cur_offline_schedule.day
                    courses_by_day[cur_offline_schedule_day].append(selected_course)
            else:
                courses_by_day["nontimes"].append(selected_course)

        # 요일별로 start_time 기준 정렬
        for day in courses_by_day:
            if day == "nontimes":
                continue
            courses_in_cur_day = courses_by_day[day]
            courses_in_cur_day.sort(key=lambda course: sort_by_start_time(course, day))

        # 현재 해의 total_course_gap 구하기
        for day in courses_by_day:
            if day == "nontimes":
                continue
            courses_in_cur_day = courses_by_day[day]
            for i in range(len(courses_in_cur_day) - 1):
                cur_course = courses_in_cur_day[i]
                next_course = courses_in_cur_day[i + 1]

                _, cur_course_end_time_in_cur_day = get_start_time_and_end_time(
                    cur_course, day
                )
                next_course_start_time_in_cur_day, __ = get_start_time_and_end_time(
                    next_course, day
                )

                total_course_gap += (
                    next_course_start_time_in_cur_day - cur_course_end_time_in_cur_day
                )

        self.solutions.append(
            {
                "solution_index": self.solution_count,
                "selected_courses": courses_by_day,
                "total_credit": total_credit,
                "total_online_course_count": total_online_course_count,
                "total_course_gap": total_course_gap,
            }
        )

        if self.solution_count >= self.solution_limit:
            print(f"Stop Search after {self.solution_limit} solutions")
            self.stop_search()

    def solution_print(self):
        for cur_solution in self.solutions:
            (
                solution_index,
                selected_courses,
                total_credit,
                total_online_course_count,
                total_course_gap,
            ) = cur_solution.values()
            print(f"{solution_index}번째 해:")

            for day in selected_courses:
                courses_in_cur_day = selected_courses[day]
                if day != "nontimes":
                    courses_in_cur_day.sort(
                        key=lambda course: sort_by_start_time(course, day)
                    )
                print(f"{day}: ")
                for cur_course in courses_in_cur_day:
                    cur_course_name = cur_course.course_name
                    cur_course_completion_type = cur_course.completion_type
                    cur_course_delivery_method = cur_course.delivery_method
                    cur_course_credit = cur_course.credit
                    cur_course_offline = cur_course.offline_schedules
                    print(
                        f"{cur_course_name}({cur_course_completion_type}, {cur_course_delivery_method}, {cur_course_credit}학점)",
                        end=" ",
                    )
                    for off in cur_course_offline:
                        place = off.place
                        start_time_hour = off.start_time // 60
                        start_time_min = off.start_time % 60

                        end_time_hour = off.end_time // 60
                        end_time_min = off.end_time % 60

                        print(
                            f"{place}, {start_time_hour:02d}:{start_time_min:02d}~{end_time_hour:02d}:{end_time_min:02d}"
                        )
            print()
            print(
                f"총 학점: {total_credit} total_course_gap: {total_course_gap} 온라인 강의 총 개수: {total_online_course_count}"
            )
            print()

    # 해를 우선순위로 정렬하는 함수
    def sort_solutions_by_priority(self):
        self.solutions.sort(
            key=lambda solution: (
                # 총 학점 많은 순
                -solution["total_credit"],
                # 온라인 강의 많은 순
                -solution["total_online_course_count"],
                # 시간 간격 적은 순
                solution["total_course_gap"],
            )
        )

    @property
    def get_solution_count(self):
        return self.solution_count

    @property
    def get_solutions(self):
        # 상위 50개만 잘라서 줌
        return self.solutions[:50]
