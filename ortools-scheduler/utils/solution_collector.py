from ortools.sat.python import cp_model
from collections import defaultdict
from .sort_by_start_time import sort_by_start_time
from schemas.common.course_schema import CourseSchema


class AllSolutionCollector(cp_model.CpSolverSolutionCallback):
    def __init__(self, is_selected, courses: CourseSchema):
        # 부모 클래스 CpSolverSolutionCallback 먼저 생성
        super().__init__()
        self.is_selected = is_selected  # BoolVar 리스트
        self.courses = courses  # 필터링된 과목 정보 리스트
        self.solution_count = 0  # 해 개수 카운터
        self.solutions = (
            []
        )  # 모든 솔루션들을 담은 배열 (몇번째 해인지, 선택된 인덱스, 총 학점)

    # 해를 찾을 때마다 부모 클래스인 CpSolverSolutionCallback에서 콜백할 함수
    def on_solution_callback(self):
        self.solution_count += 1
        selected_indices = [
            i for i, var in enumerate(self.is_selected) if self.Value(var)
        ]

        total_credit = sum(self.courses[i].credit for i in selected_indices)

        self.solutions.append(
            {
                "solution_index": self.solution_count,
                "selected_indices": selected_indices,
                "total_credit": total_credit,
            }
        )

    def solution_print(self):
        days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

        for cur_solution in self.solutions:
            solution_index, selected_indices, total_credit = cur_solution.values()
            print(f"{solution_index}번째 해:")

            course_day_indices = defaultdict(list)

            for day in days:
                course_day_indices[day] = []

            for course_index in selected_indices:
                course = self.courses[course_index]
                offline_schedule = course.offline_schedules
                for cur_off in offline_schedule:
                    cur_off_day = cur_off.day
                    course_day_indices[cur_off_day].append(course_index)

            for day in course_day_indices:
                indices_by_day = course_day_indices[day]
                indices_by_day.sort(
                    key=lambda course_index: sort_by_start_time(
                        self.courses, course_index, day
                    )
                )
                print(f"{day}: ")
                for cur_course_index in indices_by_day:
                    cur_course = self.courses[cur_course_index]
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
        print()

    @property
    def get_solution_count(self):
        return self.solution_count

    @property
    def get_solutions(self):
        return self.solutions
