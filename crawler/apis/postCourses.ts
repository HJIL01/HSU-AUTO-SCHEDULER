import { CourseType } from "types/courseType";

export async function postCourses(courses: CourseType[] | null) {
  const res = await fetch(`${process.env.BASE_URL}/crawler/postCourses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(courses || [], null, 2),
  });

  if (!res.ok) {
    throw new Error("HTTP ERROR!");
  }

  return res.json();
}
