from pydantic import BaseModel
from .course_schema import CourseSchema


class SolutionSchema(BaseModel):
    solution_index: int
    selected_courses: list[CourseSchema]
    total_credit: int
    total_course_gap: int
