import { getSemesters } from "@/api/getSemesters";
import TimeTableBody from "./_components/01_templates/TimeTableBody";
import TimeTableTitle from "./_components/01_templates/TimeTableTitle";

export default async function TimeTableMain() {
  return (
    <div>
      <TimeTableTitle />
      <TimeTableBody />
    </div>
  );
}
