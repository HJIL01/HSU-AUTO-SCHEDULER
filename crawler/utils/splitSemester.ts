export function splitSemester(semester: string) {
  const [year, term] = semester.split("-");

  return {
    semesterCode: `${year}${term}`,
    year: +year,
    term: +term,
  };
}
