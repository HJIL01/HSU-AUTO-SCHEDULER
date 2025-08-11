from pydantic import BaseModel
from app.schemas.common.course_schema import CourseSchema


class SolutionSchema(BaseModel):
    solution_index: int
    total_credit: int
    total_course_gap: int
    total_offline_course_count: int
    total_online_course_count: int
    no_class_days: list[str]
    selected_courses: list[CourseSchema]
