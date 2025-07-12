import { SemesterType } from "types/semester.type";

export function splitSemester(semester: string): SemesterType {
  const [year, term] = semester.split("-");

  return {
    semester_id: `${year}${term}`,
    year: +year,
    term: +term,
  };
}
