# 요일에 해당하는 해당 수업의 오프라인 세션을 찾아 startTime과 endTime을 return하는 함수
def get_start_time_and_end_time(course, day):
    session_info = course["sessionInfo"]
    offline_info = session_info["offline"]
    target = next(
        (
            cur_offline_info
            for cur_offline_info in offline_info
            if cur_offline_info["day"] == day
        ),
        None,
    )
    if target is None:
        raise ValueError(f"{day}에 해당하는 오프라인 장소 없음")
    target_start_time = target["startTime"]
    target_end_time = target["endTime"]
    return (target_start_time, target_end_time)
