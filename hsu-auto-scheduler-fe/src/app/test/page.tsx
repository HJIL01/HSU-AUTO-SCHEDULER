"use client";

import React from "react";
import CloseIcon from "@/assets/icons/CloseIcon";

export enum WeekdayEnum {
  MON = "Mon",
  TUE = "Tue",
  WED = "Wed",
  THU = "Thu",
  FRI = "Fri",
  SAT = "Sat",
  SUN = "Sun",
}

const s: Record<string, Record<WeekdayEnum, number[]>> = {};

const nums = Array.from({ length: 15 });

function test(semester: string) {
  s[semester] = Object.values(WeekdayEnum).reduce(
    (acc, day) => {
      acc[day] = Array(nums.length).fill(0);
      return acc;
    },
    {} as Record<WeekdayEnum, number[]>,
  );
}

export default function page() {
  return (
    <div className="flex h-dvh w-dvw items-center justify-center bg-sky-200 text-2xl">
      asd
    </div>
  );
}
