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
        self.is_selected = is_selected  # BoolVar 리스트
        self.selected_course_indicies = courses  # 필터링된 과목 정보 리스트
        self.solution_count = 0  # 해 개수 카운터
        self.solutions = (
            []
        )  # 모든 솔루션들을 담은 배열 (몇번째 해인지, 선택된 인덱스, 총 학점)

    # 해를 찾을 때마다 부모 클래스인 CpSolverSolutionCallback에서 콜백할 함수
    def on_solution_callback(self):
        self.solution_count += 1

        # 현재 해에 포함된 강의들을 담을 배열
        selected_indices = [
            i for i, var in enumerate(self.is_selected) if self.Value(var)
        ]

        # 현재 해의 총 학점 합
        total_credit = sum(
            self.selected_course_indicies[i].credit for i in selected_indices
        )

        # 1. 요일별로 묶은 후 start_time 기준으로 정렬한다
        # 2. 정렬 후엔 요일별 시간 순으로 강의가 배치되어 있으므로
        # 3. 다음 강의의 시작 시간 - 현재 강의의 끝나는 시간을 gap에 모두 더하여 total_gap을 구한다
        course_day_indices = defaultdict(list)
        total_course_gap = 0

        # 요일별로 묶기
        for selected_course_index in selected_indices:
            selected_course = self.selected_course_indicies[selected_course_index]
            selected_course_offline_schedules = selected_course.offline_schedules
            for cur_offline_schedule in selected_course_offline_schedules:
                cur_offline_schedule_day = cur_offline_schedule.day
                course_day_indices[cur_offline_schedule_day].append(
                    selected_course_index
                )

        # 요일별로 start_time 기준 정렬
        for day in course_day_indices:
            indicies_by_day = course_day_indices[day]
            indicies_by_day.sort(
                key=lambda course_index: sort_by_start_time(
                    self.selected_course_indicies, course_index, day
                )
            )

        # 현재 해의 total_course_gap 구하기
        for day in course_day_indices:
            indicies_by_day = course_day_indices[day]
            for i in range(len(indicies_by_day) - 1):
                cur_course_index = indicies_by_day[i]
                next_course_index = indicies_by_day[i + 1]

                cur_course = self.selected_course_indicies[cur_course_index]
                next_course = self.selected_course_indicies[next_course_index]

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
                "selected_indices": selected_indices,
                "total_credit": total_credit,
                "total_course_gap": total_course_gap,
            }
        )

    def solution_print(self):
        days = WeekdayEnum

        for cur_solution in self.solutions:
            solution_index, selected_indices, total_credit, total_course_gap = (
                cur_solution.values()
            )
            print(f"{solution_index}번째 해:")

            course_day_indices = defaultdict(list)

            for DAY_ENUM_KEY in days:
                day = DAY_ENUM_KEY.value
                course_day_indices[day] = []

            for course_index in selected_indices:
                course = self.selected_course_indicies[course_index]
                offline_schedule = course.offline_schedules
                for cur_off in offline_schedule:
                    cur_off_day = cur_off.day
                    course_day_indices[cur_off_day].append(course_index)

            for day in course_day_indices:
                indices_by_day = course_day_indices[day]
                indices_by_day.sort(
                    key=lambda course_index: sort_by_start_time(
                        self.selected_course_indicies, course_index, day
                    )
                )
                print(f"{day}: ")
                for cur_course_index in indices_by_day:
                    cur_course = self.selected_course_indicies[cur_course_index]
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
            print(f"총 학점: {total_credit} total_course_gap: {total_course_gap}")
            print()

    # 총 학점 합 기준 내림차순으로 정렬하는 함수
    def sort_by_total_credit_descending(self):
        self.solutions.sort(key=lambda solution: -solution["total_credit"])

    # 총 수업 간 간격 합 기준 내림차순으로 정렬하는 함수
    def sort_by_total_course_gap_ascending(self):
        self.solutions.sort(key=lambda solution: solution["total_course_gap"])

    @property
    def get_solution_count(self):
        return self.solution_count

    @property
    def get_solutions(self):
        return self.solutions
