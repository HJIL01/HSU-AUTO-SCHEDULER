import React, { useMemo } from "react";
import CPSATResultTimetableTab from "../../02_organisms/CPSATResult/tabs/CPSATResultTimetableTab";
import CPSATResultInfoSummaryTab from "../../02_organisms/CPSATResult/tabs/CPSATResultInfoSummaryTab";
import { CPSATSolutionType } from "@/types/CPSATSolution.type";
import groupCoursesByDay from "@/utils/groupCoursesByDay";
import CPSATResultOnlineCoursesTab from "../../02_organisms/CPSATResult/tabs/CPSATResultOnlineCoursesTab";
import { SelectedCoursesByDayType } from "@/types/courseRender.type";

type Props = {
  tabMode: "timetableMode" | "onlineLectureMode" | "infoSummaryMode";
  CPSATResult: CPSATSolutionType[];
  currentIndex: number;
};

export default function CPSATResultTabRenderer({
  tabMode,
  CPSATResult,
  currentIndex,
}: Props) {
  const selectedCoursesByDayList: SelectedCoursesByDayType[] = useMemo(() => {
    return CPSATResult.map((result) =>
      groupCoursesByDay(result.selected_courses),
    );
  }, [CPSATResult]);

  const renderTabContent = () => {
    switch (tabMode) {
      case "timetableMode":
        return (
          <CPSATResultTimetableTab
            selectedCoursesByDayList={selectedCoursesByDayList}
            currentIndex={currentIndex}
          />
        );
      case "onlineLectureMode":
        return (
          <CPSATResultOnlineCoursesTab
            onlineCourses={
              selectedCoursesByDayList?.[currentIndex]?.["nontimes"] ?? []
            }
          />
        );
      case "infoSummaryMode":
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
    <div
      className="bg-timetable-body-bg flex h-318 w-[75dvw] flex-col"
      onClick={() => console.log(CPSATResult[currentIndex], "클릭됨")}
    >
      {renderTabContent()}
    </div>
  );
}
