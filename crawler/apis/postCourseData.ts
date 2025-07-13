import { CourseType } from "types/course.type";
import { MajorType } from "types/major.type";
import { SemesterType } from "types/semester.type";

export async function postCourseData(
  semester: SemesterType,
  major: MajorType,
  courses: CourseType[] | null
) {
  const res = await fetch(`${process.env.BASE_URL}/crawler/course-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      {
        semester_id: semester.semester_id,
        major_code: major.major_code,
        courses,
      },
      null,
      0
    ),
  });

  if (!res.ok) {
    throw new Error(
      `Post Course: ${semester.semester_id}-${major.major_name} HTTP ERROR!`
    );
  }

  return res.json();
}
