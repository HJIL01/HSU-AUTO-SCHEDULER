import TimeTableBody from "./_components/01_templates/TimeTableBody";
import TimeTableTitle from "./_components/01_templates/TimeTableTitle";

export default async function TimeTableMain() {
  return (
    <div className="w-[70dvw] max-w-600 min-w-150">
      <TimeTableTitle />
      <TimeTableBody />
    </div>
  );
}
