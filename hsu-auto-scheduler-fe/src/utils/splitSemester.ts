export function splitSemester(semester: string) {
  const [year, term] = semester.split("-");

  return `${year}${term}`;
}
