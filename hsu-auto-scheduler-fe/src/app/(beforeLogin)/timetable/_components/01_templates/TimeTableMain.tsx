import React from "react";
import TimeTableTitle from "../02_organisms/Timetable/TimetableTitle";
import TimeTableBody from "../02_organisms/Timetable/TimetableBody";

export default function TimeTableMain() {
  return (
    <div className="w-full max-w-1000 min-w-150 md:px-10">
      <TimeTableTitle />
      <TimeTableBody />
    </div>
  );
}
