from pydantic import BaseModel
from .course_schema import CourseSchema


class SolutionSchema(BaseModel):
    solution_index: int
    total_credit: int
    total_course_gap: int
    total_online_course_count: int
    selected_courses: list[CourseSchema]
