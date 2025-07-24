import { SemesterType } from "@/types/semester.type";
import RHFSelectSemester from "../RHF/RHFSelectSemester";

type Props = {
  currentSemester?: string;
  semesters: SemesterType[];
};

export default function TimeTableTitle({ currentSemester, semesters }: Props) {
  return (
    <div className="bg-hsu flex h-26 items-center justify-between rounded-t-2xl px-10">
      <h2 className="text-2xl font-bold text-white">HSU Auto Scheduler</h2>
      <RHFSelectSemester
        currentSemestere={currentSemester}
        semesters={semesters}
      />
    </div>
  );
}
