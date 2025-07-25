import RHFSelectSemester from "../RHF/RHFSelectSemester";
import { getSemesters } from "@/api/getSemesters";

export default async function TimeTableTitle() {
  const { data: semesters } = await getSemesters();

  return (
    <div className="bg-hsu flex h-26 items-center justify-between rounded-t-2xl px-10">
      <h2 className="text-2xl font-bold text-white">HSU Auto Scheduler</h2>
      <RHFSelectSemester semesters={semesters} />
    </div>
  );
}
