import TimeTableBody from "./_components/templates/TimeTableBody";
import TimeTableTitle from "./_components/templates/TimeTableTitle";

export default function TimeTableMain() {
  return (
    <div className="h-max w-max">
      <TimeTableTitle />
      <TimeTableBody />
    </div>
  );
}
