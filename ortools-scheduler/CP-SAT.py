import json

from ortools.sat.python import cp_model

with open("../courses.json", encoding="utf-8") as f:
    courses = json.load(f)

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


# simple_sat_program()