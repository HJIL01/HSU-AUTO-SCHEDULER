"use client";

import RHFCustomSelect from "../../../../../components/RHF/RHFCustomSelect";
import { useFormContext } from "react-hook-form";
import { useGetMajors } from "@/hooks/queries/useGetMajors";
import { SelectOptionType } from "@/types/selectOption.type";
import { DayOrNightEnum, DayOrNightKorMap } from "@/enums/dayOrNight.enum";
import RHFTextInput from "@/components/RHF/RHFTextInput";
import { FocusEvent, useState } from "react";
import NoClassDaySelectModal from "../modal/NoClassDaySelectModal";
import { WeekdayKorMap } from "@/enums/weekday.enum";
import {
  CreateCPSATschemaType,
  createCPSATSchemaDefaultValues,
} from "@/types/schemas/CreateCPSAT.schema";

export default function CourseFilters() {
  // 필터: 전공, 학년, 주야, 공강 요일,
  // 최대 학점,
  // 전공 기초, 전공 필수, 전공 선택, 하루 최대 강의 수, 점심시간 보장

  const [noClassDaysSelectModalIsOpen, setNoClassDaysSelectModalIsOpen] =
    useState<boolean>(false);

  const { getValues, setValue } = useFormContext<CreateCPSATschemaType>();
  const currentSemester = getValues("semester");
  const currentNoClassDays = getValues("no_class_days");

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
      label: `[${major.major_code}] ${major.major_name}`,
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

  const fixValueMaxCreditOnBlur = (event: FocusEvent<HTMLInputElement>) => {
    const maxCredit = event.target.value;
    if (maxCredit === "") {
      alert("최대 학점을 입력해주세요.");
      setValue("max_credit", createCPSATSchemaDefaultValues.max_credit);
      return;
    }

    if (+maxCredit <= 0 || +maxCredit > 21) {
      alert("최대 학점은 0학점 이상 혹은 21학점 이하여야 합니다.");
      setValue("max_credit", createCPSATSchemaDefaultValues.max_credit);
      return;
    }
  };

  const fixValueMajorFoundationOnBlur = (
    event: FocusEvent<HTMLInputElement>,
  ) => {
    const majorFoundation = event.target.value;

    if (majorFoundation === "") {
      setValue(
        "major_foundation",
        createCPSATSchemaDefaultValues.major_foundation,
      );
      return;
    }

    if (+majorFoundation < 0 || +majorFoundation > 21) {
      alert("전공 기초는 0학점 이상 혹은 21학점 이하여야 합니다.");
      setValue(
        "major_foundation",
        createCPSATSchemaDefaultValues.major_foundation,
      );
      return;
    }
  };

  const fixValueMajorRequired = (event: FocusEvent<HTMLInputElement>) => {
    const majorRequired = event.target.value;

    if (majorRequired === "") {
      setValue("major_required", createCPSATSchemaDefaultValues.major_required);
      return;
    }

    if (+majorRequired < 0 || +majorRequired > 21) {
      alert("전공 필수는 0학점 이상 혹은 21학점 이하여야 합니다.");
      setValue("major_required", createCPSATSchemaDefaultValues.major_required);
      return;
    }
  };

  const fixValueMajorElective = (event: FocusEvent<HTMLInputElement>) => {
    const majorElective = event.target.value;

    if (majorElective === "") {
      setValue("major_elective", createCPSATSchemaDefaultValues.major_elective);
      return;
    }

    if (+majorElective < 0 || +majorElective > 21) {
      alert("전공 선택은 0학점 이상 혹은 21학점 이하여야 합니다.");
      setValue("major_elective", createCPSATSchemaDefaultValues.major_elective);
      return;
    }
  };

  const fixValueDailyLectureLimit = (event: FocusEvent<HTMLInputElement>) => {
    const dailyLectureLimit = event.target.value;

    if (dailyLectureLimit === "") {
      alert("하루 최대 강의 수를 입력해주세요.");
      setValue(
        "daily_lecture_limit",
        createCPSATSchemaDefaultValues.daily_lecture_limit,
      );
      return;
    }

    if (+dailyLectureLimit <= 0) {
      alert(
        "하루 강의는 1개 이상이어야 합니다. 공강을 원하시면 공강 요일을 선택해주세요.",
      );
      setValue(
        "daily_lecture_limit",
        createCPSATSchemaDefaultValues.daily_lecture_limit,
      );
      return;
    }
  };

  const openNoClassDaysModal = () => {
    setNoClassDaysSelectModalIsOpen(true);
  };

  const closeNoClassDaysModal = () => {
    setNoClassDaysSelectModalIsOpen(false);
  };

  return (
    <div className="flex flex-col flex-wrap justify-center gap-4 md:flex-row md:justify-start">
      {/* 전공 필터 */}
      <RHFCustomSelect<CreateCPSATschemaType>
        name="major_code"
        items={majorSelectedOptions}
        placeholder="전공을 선택하세요"
        className="!bg-course-fileter-bg border-course-list-border border"
      />

      {/* 학년 필터 */}
      <RHFCustomSelect<CreateCPSATschemaType>
        name="grade"
        items={gradeSelectOptions}
        placeholder="학년"
        className="!bg-course-fileter-bg border-course-list-border border"
      />

      {/* 주야 필터 */}
      <RHFCustomSelect<CreateCPSATschemaType>
        name="day_or_night"
        items={dayOrNightSelectOptions}
        placeholder="주/야"
        className="!bg-course-fileter-bg border-course-list-border border"
      />

      {/* 공강 필터 */}
      <RHFTextInput
        readOnly
        name=""
        id="no_class_days"
        labelText="공강 요일:"
        placeholder="공강 요일을 선택하세요"
        onClick={openNoClassDaysModal}
        value={
          currentNoClassDays.length
            ? `${currentNoClassDays.map((day) => WeekdayKorMap[day]).join(", ")}`
            : ""
        }
      />

      {/* 최대 학점 필터 */}
      <RHFTextInput<CreateCPSATschemaType>
        type="number"
        name="max_credit"
        id="max_credit"
        labelText="최대 학점:"
        className="!w-[3ch] rounded-none"
        placeholder="18"
        fixValueFuncOnBlur={fixValueMaxCreditOnBlur}
      />

      {/* 전공 기초 필터 */}
      <RHFTextInput<CreateCPSATschemaType>
        type="number"
        name="major_foundation"
        id="major_foundation"
        labelText="전공 기초(최소 학점):"
        className="!w-[3ch] rounded-none"
        placeholder="0"
        fixValueFuncOnBlur={fixValueMajorFoundationOnBlur}
      />

      {/* 전공 필수 필터 */}
      <RHFTextInput<CreateCPSATschemaType>
        type="number"
        name="major_required"
        id="major_required"
        labelText="전공 필수(최소 학점):"
        className="!w-[3ch] rounded-none"
        placeholder="0"
        fixValueFuncOnBlur={fixValueMajorRequired}
      />

      {/* 전공 선택 필터 */}
      <RHFTextInput<CreateCPSATschemaType>
        type="number"
        name="major_elective"
        id="major_elective"
        labelText="전공 선택(최소 학점):"
        className="!w-[3ch] rounded-none"
        placeholder="0"
        fixValueFuncOnBlur={fixValueMajorElective}
      />

      {/* 하루 최대 강의 수 필터 */}
      <RHFTextInput<CreateCPSATschemaType>
        type="number"
        name="daily_lecture_limit"
        id="daily_lecture_limit"
        labelText="하루 최대 강의 제한:"
        className="!w-[3ch] rounded-none"
        placeholder="3"
        fixValueFuncOnBlur={fixValueDailyLectureLimit}
      />

      <RHFTextInput<CreateCPSATschemaType>
        type="checkbox"
        name="has_lunch_break"
        id="has_lunch_break"
        labelText="점심 보장(12시~13시):"
        className="!w-[3ch] rounded-none"
      />

      {noClassDaysSelectModalIsOpen && (
        <NoClassDaySelectModal closeNoClassDaysModal={closeNoClassDaysModal} />
      )}
    </div>
  );
}
