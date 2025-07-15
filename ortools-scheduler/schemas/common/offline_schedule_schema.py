from pydantic import BaseModel
from .enums import WeekdayEnum


class OfflineScheduleSchema(BaseModel):
    day: WeekdayEnum
    start_time: int
    end_time: int
    place: str
