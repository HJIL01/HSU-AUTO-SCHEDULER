from .get_start_time_and_end_time import get_start_time_and_end_time


# 정렬 함수에서 day에 매핑되는 시작 시간 기준으로 정렬할 값(시작 시간)을 리턴하는 함수
def sort_by_start_time(course, day):
    course_start_time, _ = get_start_time_and_end_time(course, day)
    return course_start_time
