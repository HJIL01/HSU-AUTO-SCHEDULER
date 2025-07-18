import TimeTableBody from "./_components/TimeTableBody";
import TimeTableTitle from "./_components/TimeTableTitle";

export default function TimeTableMain() {
  return (
    <div className="h-max w-max">
      <TimeTableTitle />
      <TimeTableBody />
    </div>
  );
}
