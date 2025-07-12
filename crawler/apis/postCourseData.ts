import { CourseType } from "types/courseType";
import { MajorType } from "types/majorType";
import { SemesterType } from "types/semesterType";

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
        semester_id: semester.semesterCode,
        major_id: major.majorCode,
        courses,
      },
      null,
      2
    ),
  });

  if (!res.ok) {
    throw new Error(
      `Post Course: ${semester.semesterCode}-${major.majorName} HTTP ERROR!`
    );
  }

  return res.json();
}
