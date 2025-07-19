import { MajorType } from "@/types/major.type";
import { ResponseType } from "@/types/response.type";

export default async function getMajors(
  year: string,
  term: string,
): Promise<ResponseType<MajorType[]>> {
  const semesterId = `${year}${term}`;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/schedule/get-majors?semesterId=${semesterId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        tags: ["majors", `${year}-${term}`],
      },
    },
  );

  if (!res.ok) {
    throw new Error("Get Majors HTTP ERROR!");
  }

  return res.json();
}
