import { SelectedCoursesByDayType } from "@/types/courseRender.type";
import TimetableHead from "../../../03_molecules/Timetable/TimetableHead";
import { motion } from "framer-motion";
import { PersonalSchedulesByDayType } from "@/types/personalScheduleRender.type";
import CPSATTimetableSlideItem from "../../../03_molecules/CPSATResult/slide/CPSATTimetableSlideItem";

type Props = {
  selectedCoursesByDayList: SelectedCoursesByDayType[];
  personalSchdulesByDay?: PersonalSchedulesByDayType;
  currentIndex: number;
};

export default function CPSATTimetableTab({
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
              <CPSATTimetableSlideItem
                key={i}
                selectedCoursesByDay={selectedCoursesByDay}
                personalSchdulesByDay={personalSchdulesByDay}
              />
            );
          })}
        </motion.div>
      </div>
    </>
  );
}
