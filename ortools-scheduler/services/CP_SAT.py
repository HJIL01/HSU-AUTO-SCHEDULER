from ortools.sat.python import cp_model
from typing import List
from schemas.common.course_schema import CourseSchema
from schemas.common.constraints_schema import ConstraintsSchema
from utils.constraints import (
    # set_objective_maximize_credit,
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
    filtered_data: List[CourseSchema], constraints: ConstraintsSchema
):
    data_len = len(filtered_data)

    model = cp_model.CpModel()

    is_selected = [model.NewBoolVar(f"course{i}_is_selected") for i in range(data_len)]

    # set_objective_maximize_credit(filtered_data, model, is_selected)

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
        solution_collector.solution_print()

    return solution_collector.solution_count
