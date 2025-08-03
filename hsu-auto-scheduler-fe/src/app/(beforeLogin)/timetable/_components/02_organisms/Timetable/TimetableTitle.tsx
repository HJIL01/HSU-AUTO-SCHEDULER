import ResetTimetableBtn from "../../04_atoms/Timetable/ResetTimetableBtn";
import RHFSelectSemester from "../../RHF/RHFSelectSemester";
import { getSemesters } from "@/api/getSemesters";

export default async function TimeTableTitle() {
  const { data: semesters } = await getSemesters();

  return (
    <div className="bg-hsu flex h-26 items-center justify-between rounded-t-2xl px-10">
      <h2 className="inline-block w-fit text-2xl font-bold text-white max-md:text-lg max-sm:text-base">
        HSU Auto Scheduler
      </h2>
      <div className="flex items-center">
        <ResetTimetableBtn />
        <RHFSelectSemester semesters={semesters} />
      </div>
    </div>
  );
}
