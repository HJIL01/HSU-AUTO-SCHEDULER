"use client";

import RHFCustomSelect from "../../../../../components/RHF/RHFCustomSelect";
import { useFormContext } from "react-hook-form";
import { useGetMajors } from "@/hooks/queries/useGetMajors";
import { SelectOptionType } from "@/types/selectOption.type";
import { DayOrNightEnum, DayOrNightKorMap } from "@/enums/dayOrNight.enum";
import RHFTextInput from "@/components/RHF/RHFTextInput";
import { useRef, useState } from "react";
import NoClassDaySelectModal from "../05_modals/NoClassDaySelectModal";
import { WeekdayKorMap } from "@/enums/weekday.enum";
import { CreateCPSATschemaType } from "@/types/schemas/CreateCPSAT.schema";
import useFixInputValues from "@/hooks/useFixInputValues";
import clsx from "clsx";
import useHorizontalScrollByWheel from "@/hooks/useHorizontalScrollByWheel";
import FetchCPSATResult from "../04_atoms/FetchCPSATResult";

type Props = {
  hasEnoughData: boolean;
};

export default function CourseFilters({ hasEnoughData }: Props) {
  // 필터: 전공, 학년, 주야, 공강 요일,
  // 최대 학점,
  // 전공 기초, 전공 필수, 전공 선택, 하루 최대 강의 수, 점심시간 보장
  const [isLeftEnded, setIsLeftEnded] = useState<boolean>(true);
  const [isRightEnded, setIsRightEnded] = useState<boolean>(false);
  const filterContainerRef = useRef<HTMLDivElement | null>(null);

  useHorizontalScrollByWheel(
    filterContainerRef,
    setIsLeftEnded,
    setIsRightEnded,
  );

  const [noClassDaysSelectModalIsOpen, setNoClassDaysSelectModalIsOpen] =
    useState<boolean>(false);

  const { getValues } = useFormContext<CreateCPSATschemaType>();

  const {
    fixValueMaxCreditOnBlur,
    fixValueMajorRequired,
    fixValueMajorFoundationOnBlur,
    fixValueMajorElective,
    fixValueDailyLectureLimit,
  } = useFixInputValues();

  const currentSemester = getValues("semester");
  const currentNoClassDays = getValues("no_class_days");

  // 해당 학기의 모든 전공들을 가져오는 훅
  const { data: getMajorsResponse, isFetching: getMajorsFetching } =
    useGetMajors(currentSemester);

  if (getMajorsFetching) {
    return <div className="h-14 w-full" />;
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

  const openNoClassDaysModal = () => {
    setNoClassDaysSelectModalIsOpen(true);
  };

  const closeNoClassDaysModal = () => {
    setNoClassDaysSelectModalIsOpen(false);
  };

  return (
    <div className="flex h-14 justify-between">
      <div className="relative">
        {/* 엣지 페이드 */}
        <div
          className={clsx(
            "absolute top-0 left-0 z-(--z-index-course-finder-edge-fader) h-full transition-all duration-75",
            !isLeftEnded ? "w-5" : "w-0",
          )}
          style={{
            background:
              "linear-gradient(to left, transparent 25%, var(--color-course-finder-main-bg) 100%)",
          }}
        />
        <div
          className={clsx(
            "absolute top-0 right-0 z-(--z-index-course-finder-edge-fader) h-full transition-all duration-75",
            !isRightEnded ? "w-5" : "w-0",
          )}
          style={{
            background:
              "linear-gradient(to right, transparent 0%, var(--color-course-finder-main-bg) 75%)",
          }}
        />

        {/* 필터 컨테이너 */}
        <div
          ref={filterContainerRef}
          className={clsx(
            "scrollbarHidden flex max-w-[72dvw] gap-4 overflow-x-auto",
          )}
        >
          {/* 전공 필터 */}
          <RHFCustomSelect<CreateCPSATschemaType>
            name="major_code"
            items={majorSelectedOptions}
            placeholder="전공을 선택하세요"
            className="!bg-course-finder-filter-bg border-course-finder-border max-w-130 truncate border"
          />
          {/* 학년 필터 */}
          <RHFCustomSelect<CreateCPSATschemaType>
            name="grade"
            items={gradeSelectOptions}
            placeholder="학년"
            className="!bg-course-finder-filter-bg border-course-finder-border border"
          />
          {/* 주야 필터 */}
          <RHFCustomSelect<CreateCPSATschemaType>
            name="day_or_night"
            items={dayOrNightSelectOptions}
            placeholder="주/야"
            className="!bg-course-finder-filter-bg border-course-finder-border border"
          />
          {/* 공강 필터 */}
          <RHFTextInput
            readOnly
            name="noname"
            id="no_class_days"
            labelText="공강 요일:"
            placeholder="공강 요일을 선택하세요"
            className="min-w-30 truncate"
            onClick={openNoClassDaysModal}
            value={
              currentNoClassDays.length
                ? `${currentNoClassDays.map((day) => WeekdayKorMap[day]).join(", ")}`
                : "없음"
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
            <NoClassDaySelectModal
              closeNoClassDaysModal={closeNoClassDaysModal}
            />
          )}
        </div>
      </div>
      <FetchCPSATResult hasEnoughData={hasEnoughData} />
    </div>
  );
}
