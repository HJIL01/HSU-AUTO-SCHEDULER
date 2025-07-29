import React from "react";
import TimeTableTitle from "../02_organisms/TimeTableTitle";
import TimeTableBody from "../02_organisms/TimeTableBody";

export default function TimeTableMain() {
  return (
    <div className="w-full max-w-1000 min-w-150 px-10">
      <TimeTableTitle />
      <TimeTableBody />
    </div>
  );
}
