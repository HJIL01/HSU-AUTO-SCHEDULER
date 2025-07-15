from pydantic import BaseModel
from typing import List
from schemas.common.course_schema import CourseSchema
from schemas.common.constraints_schema import ConstraintsSchema


class CPSATRequestSchema(BaseModel):
    filtered_data: List[CourseSchema]
    constraints: ConstraintsSchema
