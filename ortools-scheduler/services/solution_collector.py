from ortools.sat.python import cp_model
from schemas.common.course_schema import CourseSchema
from schemas.common.solution_schema import SolutionSchema
from utils.group_courses_by_day import group_courses_by_day
from utils.get_total_course_gap import get_total_course_gap
from utils.has_common_grade import has_common_grade


class AllSolutionCollector(cp_model.CpSolverSolutionCallback):
    def __init__(self, is_selected, courses: list[CourseSchema]):
        # 부모 클래스 CpSolverSolutionCallback 먼저 생성
        super().__init__()
        self.courses: list[CourseSchema] = (
            courses  # 필터링되어서 백엔드에서 넘어온 강의들
        )
        self.is_selected = is_selected  # BoolVar 리스트
        self.solution_count = 0  # 해 개수 카운터
        self.solutions: list[SolutionSchema] = (
            []
        )  # 모든 솔루션들을 담은 배열 (몇번째 해인지, 선택된 인덱스, 총 학점)
        # 최대 해 개수
        self.solution_limit = 7000

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

        # 현재 해의 강의 당 간격 합
        total_course_gap = get_total_course_gap(group_courses_by_day(selected_courses))

        # 현재 해의 총 온라인 강의 개수
        total_online_course_count = sum(
            1
            for selected_course in selected_courses
            if selected_course.delivery_method == "온라인100%"
        )

        self.solutions.append(
            SolutionSchema(
                solution_index=self.solution_count,
                total_credit=total_credit,
                total_course_gap=total_course_gap,
                total_online_course_count=total_online_course_count,
                selected_courses=selected_courses,
            )
        )

        if self.solution_count >= self.solution_limit:
            print(f"Stop Search after {self.solution_limit} solutions")
            self.stop_search()

    # 해를 우선순위로 정렬하는 함수
    def sort_solutions_by_priority(self):
        self.solutions.sort(
            key=lambda solution: (
                # 전학년 강의가 적은 순
                has_common_grade(solution.selected_courses),
                # 총 학점 많은 순
                -solution.total_credit,
                # 온라인 강의 많은 순
                -solution.total_online_course_count,
                # 시간 간격 적은 순
                solution.total_course_gap,
            )
        )

    @property
    def get_solution_count(self):
        return self.solution_count

    @property
    def get_solutions(self):
        # 상위 500개만 잘라서 줌
        return self.solutions[:500]
