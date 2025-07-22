import TimeTableBody from "./_components/01_templates/TimeTableBody";
import TimeTableTitle from "./_components/01_templates/TimeTableTitle";

export default function TimeTableMain() {
  return (
    <div className="h-[50dvh]">
      <TimeTableTitle />
      <TimeTableBody />
    </div>
  );
}
