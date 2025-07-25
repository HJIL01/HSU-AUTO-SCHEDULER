"use client";

import React from "react";
import TimeTableGrid from "../(beforeLogin)/timetable/_components/03_molecules/TimeTableGrid";

export default function page() {
  return (
    <div className="relative h-500 w-200">
      <div className="absolute z-[var(--custom-z-index20)] h-100 w-100 bg-red-300">
        z10
      </div>
      <div className="absolute z-[var(--custom-z-index10)] h-100 w-100 bg-amber-500">
        z20
      </div>
    </div>
  );
}
