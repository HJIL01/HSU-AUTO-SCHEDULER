import RHFSelectSemester from "./RHF/RHFSelectSemester";
import { getSemesters } from "@/api/getSemesters";

export default async function TimeTableTitle() {
  const { data: semesters } = await getSemesters();

  return (
    <div className="bg-hsu flex justify-between rounded-t-2xl px-10 py-5">
      <h2 className="text-2xl font-bold text-white">HSU Auto Scheduler</h2>
      <RHFSelectSemester semesters={semesters} />
    </div>
  );
}
