import { SelectedCoursesByDayType } from "@/types/courseRender.type";
import TimeTableGrid from "../../../03_molecules/Timetable/TimeTableGrid";
import TimetableHead from "../../../03_molecules/Timetable/TimetableHead";
import { motion } from "framer-motion";
import { PersonalSchedulesByDayType } from "@/types/personalScheduleRender.type";
import OnlineCourseListForTimetable from "../../../03_molecules/Timetable/OnlineCourseListForTimetable";

type Props = {
  selectedCoursesByDayList: SelectedCoursesByDayType[];
  personalSchdulesByDay?: PersonalSchedulesByDayType;
  currentIndex: number;
};

export default function CPSATResultTimetableTab({
  selectedCoursesByDayList,
  personalSchdulesByDay,
  currentIndex,
}: Props) {
  return (
    <>
      <TimetableHead isCPSATResult />
      <div className="flex overflow-x-hidden">
        <motion.div
          className="flex w-full"
          initial={{
            translateX: `-${currentIndex * 100}%`,
          }}
          animate={{
            translateX: `-${currentIndex * 100}%`,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {selectedCoursesByDayList.map((selectedCoursesByDay, i) => {
            return (
              <div
                key={i}
                className="flex h-fit w-full shrink-0 flex-col gap-10 bg-white"
              >
                <TimeTableGrid
                  selectedCoursesByDay={selectedCoursesByDay}
                  personalSchedulesByDay={personalSchdulesByDay}
                  isCPSATResult={true}
                />
                {selectedCoursesByDay && selectedCoursesByDay["nontimes"] && (
                  <OnlineCourseListForTimetable
                    onlineCourses={selectedCoursesByDay["nontimes"]}
                    isCPSATResult={true}
                  />
                )}
              </div>
            );
          })}
        </motion.div>
      </div>
    </>
  );
}
