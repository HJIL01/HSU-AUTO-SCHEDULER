"use client";

import React from "react";
import TimeTableGrid from "../(beforeLogin)/timetable/_components/03_molecules/TimeTableGrid";
import CloseIcon from "@/assets/icons/CloseIcon";
import CloseIcon2 from "@/assets/icons/close-icon.svg";
import Image from "next/image";

export default function page() {
  return (
    <div className="relative h-500 w-200 bg-red-500">
      <div className="aspect-square w-10">
        <CloseIcon />
      </div>
    </div>
  );
}
