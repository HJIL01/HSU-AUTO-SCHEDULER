from schemas.common.course_schema import CourseSchema


def has_common_grade(courses: list[CourseSchema]):
    for course in courses:
        if 0 in course.grades:
            return True

    return False
