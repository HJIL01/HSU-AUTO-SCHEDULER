from ortools.sat.python import cp_model
from schemas.common.course_schema import CourseSchema
from schemas.common.constraints_schema import ConstraintsSchema
from utils.constraints import (
    # set_objective_maximize_credit,
    add_pre_selected_course_constraint,
    add_max_credit_constraint,
    add_deduplicated_course_constraint,
    add_major_foundation_min_constraint,
    add_major_required_min_constraint,
    add_major_elective_min_constraint,
    add_daily_lecture_limit_constraint,
    add_non_overlapping_schedule_constraint,
)
from utils.solution_collector import AllSolutionCollector


def HSU_AUTO_SCHEDULER_CP_SAT(
    filtered_data: list[CourseSchema],
    pre_selected_courses: list[CourseSchema],
    constraints: ConstraintsSchema,
):
    data_len = len(filtered_data)

    model = cp_model.CpModel()

    is_selected = [model.NewBoolVar(f"course{i}_is_selected") for i in range(data_len)]

    # set_objective_maximize_credit(filtered_data, model, is_selected)
    add_pre_selected_course_constraint(
        filtered_data, model, is_selected, pre_selected_courses
    )
    add_max_credit_constraint(filtered_data, model, is_selected, constraints.max_credit)
    add_deduplicated_course_constraint(filtered_data, model, is_selected)
    add_major_foundation_min_constraint(
        filtered_data, model, is_selected, constraints.major_foundation
    )
    add_major_required_min_constraint(
        filtered_data, model, is_selected, constraints.major_required
    )
    add_major_elective_min_constraint(
        filtered_data, model, is_selected, constraints.major_elective
    )
    add_daily_lecture_limit_constraint(
        filtered_data, model, is_selected, constraints.daily_lecture_limit
    )
    add_non_overlapping_schedule_constraint(filtered_data, model, is_selected)

    solver = cp_model.CpSolver()
    solution_collector = AllSolutionCollector(is_selected, filtered_data)

    # Enumerate all solutions.
    solver.parameters.enumerate_all_solutions = True

    # Solve
    status = solver.solve(model, solution_collector)

    if status == cp_model.INFEASIBLE:
        print("해가 존재하지 않음")

    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        # 해가 나왔다면 학점 기준 내림차순 정렬(학점이 높은 순으로 주기 위해서)
        solution_collector.sort_by_total_credit_descending()

        # 해가 나왔다면 총 수업 간 간격(분) 기준 오름차순 정렬(연강 간격이 작은 순으로 주기 위해서)
        solution_collector.sort_by_total_course_gap_ascending()

        # 디버깅용
        # 정렬 후 해를 print 하므로 n번째 해 << 이것이 뒤죽박죽일 수 있음
        solution_collector.solution_print()
        print(solution_collector.solution_count)

    return solution_collector.solution_count
