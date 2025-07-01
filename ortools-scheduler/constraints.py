# 최대 학점 제한하는 제약조건 함수
def add_max_credit_constraint(courses, model, selected, max_credit: int):
    model.Add(
        sum(
            selected_course * course["credit"]
            for selected_course, course in zip(selected, courses)
        )
        <= max_credit
    )


# 최대 학점을 지향하는 제약조건 함수
# 이게 없다면 0학점도 나올 수 있다
def set_objective_max_credit(courses, model, selected):
    model.Maximize(
        sum(
            selected_course * course["credit"]
            for selected_course, course in zip(selected, courses)
        )
    )
