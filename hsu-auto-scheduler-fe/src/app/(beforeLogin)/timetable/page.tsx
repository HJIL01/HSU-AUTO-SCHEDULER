import CourseFinder from "./_components/01_templates/CourseFinder";
import TimeTable from "./_components/01_templates/TimeTable";

export default function TimeTableMain() {
  return (
    <div className="relative flex max-h-[80dvh] gap-15 overflow-y-auto">
      <CourseFinder />
      <TimeTable />
    </div>
  );
}
