from pydantic import BaseModel, Field


class ConstraintsSchema(BaseModel):
    max_credit: int = Field(..., description="최대 학점")
    major_foundation: int = Field(..., description="전공 기초 최소 학점")
    major_required: int = Field(..., description="전공 필수 최소 학점")
    major_elective: int = Field(..., description="전공 선택 최소 학점")
    daily_lecture_limit: int = Field(..., description="하루 최대 강의 제한")
    allowed_gap_mins: int = Field(..., description="수업 간 시간 간격(분)")
    has_lunch_break: bool = Field(..., description="점심 시간 보장 여부")
