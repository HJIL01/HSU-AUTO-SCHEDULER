"use client";

import { Dispatch, SetStateAction, useMemo } from "react";
import CPSATResultTimetableTab from "../../02_organisms/CPSATResult/tabs/CPSATResultTimetableTab";
import CPSATResultInfoSummaryTab from "../../02_organisms/CPSATResult/tabs/CPSATResultInfoSummaryTab";
import { CPSATSolutionType } from "@/types/CPSATSolution.type";
import groupCoursesByDay from "@/utils/groupCoursesByDay";
import { SelectedCoursesByDayType } from "@/types/courseRender.type";
import { useTimetableStore } from "@/store/timetable/timetableStore";
import { useShallow } from "zustand/shallow";
import useCurrentSemester from "@/hooks/useCurrentSemester";
import { PersonalSchedulesByDayType } from "@/types/personalScheduleRender.type";
import groupPersonalScheduleByDay from "@/utils/groupPersonalSchedulesByDay";
import CPSATTabNavigation from "./CPSATTabNavigation";

type Props = {
  tabMode: "timetableMode" | "summaryMode";
  setTabMode: Dispatch<SetStateAction<"timetableMode" | "summaryMode">>;
  CPSATResult: CPSATSolutionType[];
  currentIndex: number;
};

export default function CPSATResultTabRenderer({
  tabMode,
  setTabMode,
  CPSATResult,
  currentIndex,
}: Props) {
  const currentSemester = useCurrentSemester();
  const { personalSchedules } = useTimetableStore(
    useShallow((state) => ({
      personalSchedules: state.personalSchedules,
    })),
  );

  const personalSchedulesInCurSemester = personalSchedules[currentSemester];

  const selectedCoursesByDayList: SelectedCoursesByDayType[] = useMemo(() => {
    return CPSATResult.map((result) =>
      groupCoursesByDay(result.selected_courses, true),
    );
  }, [CPSATResult]);

  const personalSchedulesByDay: PersonalSchedulesByDayType | undefined =
    useMemo(() => {
      if (!personalSchedulesInCurSemester) {
        return undefined;
      }

      return groupPersonalScheduleByDay(personalSchedulesInCurSemester, true);
    }, [personalSchedulesInCurSemester]);

  const renderTabContent = () => {
    switch (tabMode) {
      case "timetableMode":
        return (
          <CPSATResultTimetableTab
            selectedCoursesByDayList={selectedCoursesByDayList}
            personalSchdulesByDay={personalSchedulesByDay}
            currentIndex={currentIndex}
          />
        );
      case "summaryMode":
        return (
          <CPSATResultInfoSummaryTab
            totalCredit={CPSATResult[currentIndex].total_credit}
            onlineCourseCount={
              CPSATResult[currentIndex].total_online_course_count
            }
            currentIndex={currentIndex}
            selectedCoursesByDayList={selectedCoursesByDayList}
          />
        );
    }
  };

  return (
    <div className="flex h-full flex-col">
      <CPSATTabNavigation tabMode={tabMode} setTabMode={setTabMode} />
      <div className="h-[calc(100%-104px)] overflow-y-auto">
        {renderTabContent()}
      </div>
    </div>
  );
}
