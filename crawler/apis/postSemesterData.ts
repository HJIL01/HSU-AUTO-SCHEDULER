import { SemesterType } from "types/semesterType";

export async function postSemesterData(semester: SemesterType) {
  console.log(semester);
  const res = await fetch(`${process.env.BASE_URL}/crawler/semester-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(semester, null, 2),
  });

  if (!res.ok) {
    throw new Error(`Post Semester: ${semester.semesterCode} HTTP ERROR!`);
  }

  return res.json();
}
