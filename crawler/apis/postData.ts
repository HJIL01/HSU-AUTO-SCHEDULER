import { CourseType } from "types/courseType";
import { MajorType } from "types/majorType";
import { SemesterType } from "types/semesterType";

export async function postData(
  semester: SemesterType,
  major: MajorType,
  courses: CourseType[] | null
) {
  const res = await fetch(`${process.env.BASE_URL}/crawler/postCourses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      {
        semester,
        major,
        courses,
      },
      null,
      2
    ),
  });

  if (!res.ok) {
    throw new Error("HTTP ERROR!");
  }

  return res.json();
}
