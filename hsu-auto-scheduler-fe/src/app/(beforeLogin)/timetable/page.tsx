import { getSemesters } from "@/api/getSemesters";
import TimeTableBody from "./_components/01_templates/TimeTableBody";
import TimeTableTitle from "./_components/01_templates/TimeTableTitle";

type Props = {
  searchParams: Promise<{ semester?: string }>;
};

export default async function TimeTableMain({ searchParams }: Props) {
  const [{ semester: currentSemester }, { data: semesters }] =
    await Promise.all([searchParams, getSemesters()]);

  console.log(currentSemester);
  return (
    <div>
      <TimeTableTitle currentSemester={currentSemester} semesters={semesters} />
      <TimeTableBody />
    </div>
  );
}
