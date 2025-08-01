import React from "react";
import CPSATResultTimetableTab from "../../02_organisms/CPSATResult/tabs/CPSATResultTimetableTab";
import CPSATResultInfoSummaryTab from "../../02_organisms/CPSATResult/tabs/CPSATResultInfoSummaryTab";
import { CPSATSolutionType } from "@/types/CPSATSolution.type";
import groupCoursesByDay from "@/utils/groupCoursesByDay";
import { SelectedCoursesRenderMapType } from "@/types/courseRenderInfo.type";
import CPSATResultOnlineCoursesTab from "../../02_organisms/CPSATResult/tabs/CPSATResultOnlineCoursesTab";

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
  const selectedCoursesByDayList: SelectedCoursesRenderMapType[] =
    CPSATResult.map((result) => groupCoursesByDay(result.selected_courses));

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
              selectedCoursesByDayList[currentIndex].get("nontimes") ?? []
            }
          />
        );
      case "infoSummaryMode":
        return <CPSATResultInfoSummaryTab />;
    }
  };

  return (
    <div className="bg-timetable-body-bg flex h-[634.4px] w-[75dvw] flex-col">
      {renderTabContent()}
    </div>
  );
}
