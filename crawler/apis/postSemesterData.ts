import { SemesterType } from "types/semester.type";

export async function postSemesterData(semester: SemesterType) {
  const res = await fetch(`${process.env.BASE_URL}/crawler/semester-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(semester, null, 0),
  });

  if (!res.ok) {
    throw new Error(`Post Semester: ${semester.semester_id} HTTP ERROR!`);
  }

  return res.json();
}
