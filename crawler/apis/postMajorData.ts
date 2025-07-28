import { MajorType } from "types/major.type";

export async function postMajorData(semester_id: string, majors: MajorType[]) {
  const res = await fetch(`${process.env.BASE_URL}/crawler/major-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      semester_id,
      majors,
    }),
  });

  if (!res.ok) {
    throw new Error(`Post Major: ${semester_id}-Majors HTTP ERROR!`);
  }

  return res.json();
}
