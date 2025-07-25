import React from "react";
import TimeTableTitle from "../02_organisms/TimeTableTitle";
import TimeTableBody from "../02_organisms/TimeTableBody";

export default function TimeTableMain() {
  return (
    <div className="w-[70dvw] max-w-600 min-w-150">
      <TimeTableTitle />
      <TimeTableBody />
    </div>
  );
}
