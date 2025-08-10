from pydantic import BaseModel
from schemas.common.course_schema import CourseSchema
from schemas.common.constraints_schema import ConstraintsSchema


class CPSATRequestSchema(BaseModel):
    filtered_data: list[CourseSchema]
    pre_selected_courses: list[CourseSchema]
    constraints: ConstraintsSchema
