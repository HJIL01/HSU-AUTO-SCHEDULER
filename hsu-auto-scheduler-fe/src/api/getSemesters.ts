export async function getSemesters() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/schedule/get-semesters`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        tags: ["semesters"],
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Get Semesters HTTP ERROR!");
  }

  return res.json();
}
