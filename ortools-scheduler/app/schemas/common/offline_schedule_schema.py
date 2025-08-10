from pydantic import BaseModel
from app.schemas.common.enums import WeekdayEnum


class OfflineScheduleSchema(BaseModel):
    offline_schedule_id: str
    day: WeekdayEnum
    start_time: int
    end_time: int
    place: str
