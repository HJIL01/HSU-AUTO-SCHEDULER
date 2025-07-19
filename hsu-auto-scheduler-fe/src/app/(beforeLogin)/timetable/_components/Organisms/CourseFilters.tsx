"use client";

import RHFSelectDayOrNight from "../RHF/RHFSelectDayOrNight";
import RHFSelectGrade from "../RHF/RHFSelectGrade";
import RHFSelectMajor from "../RHF/RHFSelectMajor";

export default function CourseFilters() {
  // 필터: 전공, 학년, 주야, 공강 요일,
  // 최대 학점,
  // 전공 기초, 전공 필수, 전공 선택, 하루 최대 강의 수, 점심시간 보장

  return (
    <div className="flex gap-4">
      <RHFSelectMajor />
      <RHFSelectGrade />
      <RHFSelectDayOrNight />
      <button></button>
    </div>
  );
}
