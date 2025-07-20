"use client";

import RHFCustomSelect from "../../../../../components/RHF/RHFCustomSelect";
import { useFormContext } from "react-hook-form";
import { SchemaType } from "@/types/schema";
import { useGetMajors } from "@/hooks/queries/useGetMajors";
import { SelectOptionType } from "@/types/selectOption.type";
import { DayOrNightEnum, DayOrNightKorMap } from "@/enums/dayOrNight.enum";
import RHFTextInput from "@/components/RHF/RHFTextInput";
import { useState } from "react";
import NoClassDaySelectModal from "../modal/NoClassDaySelectModal";
import { WeekdayKorMap } from "@/enums/weekday.enum";

export default function CourseFilters() {
  // 필터: 전공, 학년, 주야, 공강 요일,
  // 최대 학점,
  // 전공 기초, 전공 필수, 전공 선택, 하루 최대 강의 수, 점심시간 보장

  const [noClassDaysSelectModalIsOpen, setNoClassDaysSelectModalIsOpen] =
    useState<boolean>(false);

  const { getValues } = useFormContext<SchemaType>();
  const currentSemester = getValues("semester");
  const currentNoClassDays = getValues("noClassDays");

  // 해당 학기의 모든 전공들을 가져오는 훅
  const { data: getMajorsResponse, isPending: getMajorsPending } =
    useGetMajors(currentSemester);

  if (getMajorsPending) {
    console.log("준비중");
    return;
  }

  // 전공 선택 리스트
  const majorSelectedOptions: SelectOptionType[] =
    getMajorsResponse?.data.map((major) => ({
      value: major.major_code,
      label: major.major_name,
    })) ?? [];

  // 학년 선택 리스트
  const gradeSelectOptions: SelectOptionType[] = Array.from({ length: 4 }).map(
    (_, i) => ({
      value: i + 1,
      label: i + 1,
    }),
  );

  // 주야 선택 리스트
  const dayOrNightSelectOptions: SelectOptionType[] = [
    DayOrNightEnum.DAY,
    DayOrNightEnum.NIGHT,
  ]
    .slice(0, 2)
    .map((e) => ({
      value: e,
      label: DayOrNightKorMap[e],
    }));

  const openNoClassDaysModal = () => {
    setNoClassDaysSelectModalIsOpen(true);
  };

  const closeNoClassDaysModal = () => {
    setNoClassDaysSelectModalIsOpen(false);
  };

  return (
    <div className="flex flex-col flex-wrap justify-center gap-4 md:flex-row md:justify-start">
      {/* 전공 필터 */}
      <RHFCustomSelect<SchemaType>
        name="major"
        items={majorSelectedOptions}
        placeholder="전공을 선택하세요"
        className="!bg-course-fileter-bg border-course-list-border border"
      />

      {/* 학년 필터 */}
      <RHFCustomSelect<SchemaType>
        name="grade"
        items={gradeSelectOptions}
        placeholder="학년"
        className="!bg-course-fileter-bg border-course-list-border border"
      />

      {/* 주야 필터 */}
      <RHFCustomSelect<SchemaType>
        name="dayOrNight"
        items={dayOrNightSelectOptions}
        placeholder="주/야"
        className="!bg-course-fileter-bg border-course-list-border border"
      />

      {/* 공강 필터 */}
      <RHFTextInput
        readOnly
        name=""
        id="noClassDays"
        labelText="공강 요일:"
        className=""
        placeholder="공강 요일을 선택하세요"
        onClick={openNoClassDaysModal}
        value={
          currentNoClassDays.length
            ? `${currentNoClassDays.map((day) => WeekdayKorMap[day]).join(", ")}`
            : ""
        }
      />

      {/* 최대 학점 필터 */}
      <RHFTextInput<SchemaType>
        type="number"
        name="maxCredit"
        id="maxCredit"
        labelText="최대 학점:"
        className="!w-[3ch]"
        placeholder="18"
      />

      {/* 전공 기초 필터 */}
      <RHFTextInput<SchemaType>
        type="number"
        name="majorFoundation"
        id="majorFoundation"
        labelText="전공 기초:"
        className="!w-[3ch]"
        placeholder="0"
      />

      {/* 전공 필수 필터 */}
      <RHFTextInput<SchemaType>
        type="number"
        name="majorRequired"
        id="majorRequired"
        labelText="전공 필수:"
        className="!w-[3ch]"
        placeholder="0"
      />

      {/* 전공 선택 필터 */}
      <RHFTextInput<SchemaType>
        type="number"
        name="majorElective"
        id="majorElective"
        labelText="전공 선택:"
        className="!w-[3ch]"
        placeholder="0"
      />

      {/* 하루 최대 강의 수 필터 */}
      <RHFTextInput<SchemaType>
        type="number"
        name="dailyLectureLimit"
        id="dailyLectureLimit"
        labelText="하루 최대 강의 제한:"
        className="!w-[3ch]"
        placeholder="3"
      />

      {noClassDaysSelectModalIsOpen && (
        <NoClassDaySelectModal closeNoClassDaysModal={closeNoClassDaysModal} />
      )}
    </div>
  );
}
