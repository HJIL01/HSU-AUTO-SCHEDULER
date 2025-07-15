from pydantic import BaseModel, Field
from typing import Optional
from .enums import DayOrNightEnum
from .offline_schedule_schema import OfflineScheduleSchema


class CourseSchema(BaseModel):
    semester_id: str = Field(..., description="학기 ID")
    course_id: str = Field(..., description="강의 ID")
    course_code: str = Field(..., description="강의 코드")
    course_name: str = Field(..., description="강의 이름")
    professor_names: list[str] = Field(..., min_items=1, description="교수 이름 리스트")
    completion_type: str = Field(..., description="이수 구분")
    delivery_method: str = Field(..., description="수업 방식")

    credit: int = Field(..., description="학점", ge=0)
    day_or_night: DayOrNightEnum = Field(..., description="주간/야간 여부")

    class_section: str = Field(..., description="분반")
    grade: int = Field(..., description="대상 학년", ge=0)

    grade_limit: Optional[str] = Field(None, description="학년 제한")
    online_min: float = Field(..., description="온라인 수업 시간", ge=0)
    offline_schedules: Optional[list[OfflineScheduleSchema]] = Field(
        None, description="오프라인 시간표"
    )
    plan_code: Optional[str] = Field(None, description="계획 코드")
