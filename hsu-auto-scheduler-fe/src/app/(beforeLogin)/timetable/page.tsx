import TimeTableBody from "./_components/Templates/TimeTableBody";
import TimeTableTitle from "./_components/Templates/TimeTableTitle";

export default function TimeTableMain() {
  return (
    <div className="h-max w-max">
      <TimeTableTitle />
      <TimeTableBody />
    </div>
  );
}
