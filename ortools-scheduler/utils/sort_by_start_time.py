from .get_start_time_and_end_time import get_start_time_and_end_time


#
def sort_by_start_time(courses, course_index, day):
    target_course = courses[course_index]
    target_course_start_time, _ = get_start_time_and_end_time(target_course, day)
    return target_course_start_time
