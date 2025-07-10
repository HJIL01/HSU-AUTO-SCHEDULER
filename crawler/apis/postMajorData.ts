import { MajorType } from "types/majorType";

export async function postMajorData(semesterCode: string, major: MajorType) {
  const res = await fetch(`${process.env.BASE_URL}/crawler/postMajorData`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      semester_id: semesterCode,
      major,
    }),
  });

  if (!res.ok) {
    throw new Error(
      `Post Major: ${semesterCode}-${major.majorName} HTTP ERROR!`
    );
  }

  return res.json();
}
