import { MajorType } from "@/types/major.type";
import { ResponseType } from "@/types/response.type";
import { splitSemester } from "@/utils/splitSemester";

export default async function getMajors(
  semesterString: string,
): Promise<ResponseType<MajorType[]>> {
  const semesterId = splitSemester(semesterString);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/schedule/get-majors?semesterId=${semesterId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        tags: ["majors", semesterString],
      },
    },
  );

  if (!res.ok) {
    throw new Error("Get Majors HTTP ERROR!");
  }

  return res.json();
}
