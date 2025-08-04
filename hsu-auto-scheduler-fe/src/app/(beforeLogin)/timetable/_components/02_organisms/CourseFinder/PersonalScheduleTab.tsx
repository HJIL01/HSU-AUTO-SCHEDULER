"use client";

import Plus from "@/assets/icons/Plus";
import { WeekdayEnum } from "@/enums/weekday.enum";
import { PersonalScheduleType } from "@/types/schemas/PersonalSchedule.schema";
import clsx from "clsx";
import PersonalScheduleCard from "../../03_molecules/CourseFinder/PersonalScheduleCard";
import PersonalScheduleAddCard from "../../03_molecules/CourseFinder/PersonalScheduleAddCard";
import { useShallow } from "zustand/shallow";
import PersonalScheduleModal from "../../05_modals/PersonalScheduleModal";
import { useTimetableStore } from "@/store/timetable/timetableStore";

export default function PersonalScheduleTab() {
  const schedules: PersonalScheduleType[] = [
    {
      personal_schedule_id: crypto.randomUUID(),
      schedule_name: "스케줄1",
      offline_schedules: [
        {
          offline_schedule_id: crypto.randomUUID(),
          start_time: 900,
          end_time: 960,
          day: WeekdayEnum.MON,
          place: "공학관 101호",
        },
        {
          offline_schedule_id: crypto.randomUUID(),
          start_time: 1000,
          end_time: 1100,
          day: WeekdayEnum.WED,
          place: "인문관 203호",
        },
        {
          offline_schedule_id: crypto.randomUUID(),
          start_time: 1300,
          end_time: 1430,
          day: WeekdayEnum.FRI,
          place: "자연대 303호",
        },
      ],
    },
    {
      personal_schedule_id: crypto.randomUUID(),
      schedule_name: "스케줄2",
      offline_schedules: [
        {
          offline_schedule_id: crypto.randomUUID(),
          start_time: 930,
          end_time: 1030,
          day: WeekdayEnum.TUE,
          place: "사회과학관 205호",
        },
        {
          offline_schedule_id: crypto.randomUUID(),
          start_time: 1100,
          end_time: 1200,
          day: WeekdayEnum.THU,
          place: "도서관 세미나실",
        },
      ],
    },
    {
      personal_schedule_id: crypto.randomUUID(),
      schedule_name: "스케줄3",
      offline_schedules: [
        {
          offline_schedule_id: crypto.randomUUID(),
          start_time: 800,
          end_time: 850,
          day: WeekdayEnum.MON,
          place: "기초관 101호",
        },
        {
          offline_schedule_id: crypto.randomUUID(),
          start_time: 1400,
          end_time: 1530,
          day: WeekdayEnum.WED,
          place: "전산관 202호",
        },
        {
          offline_schedule_id: crypto.randomUUID(),
          start_time: 1600,
          end_time: 1700,
          day: WeekdayEnum.FRI,
        },
      ],
    },
    {
      personal_schedule_id: crypto.randomUUID(),
      schedule_name: "스케줄3",
      offline_schedules: [
        {
          offline_schedule_id: crypto.randomUUID(),
          start_time: 800,
          end_time: 850,
          day: WeekdayEnum.MON,
          place: "기초관 101호",
        },
        {
          offline_schedule_id: crypto.randomUUID(),
          start_time: 1400,
          end_time: 1530,
          day: WeekdayEnum.WED,
          place: "전산관 202호",
        },
        {
          offline_schedule_id: crypto.randomUUID(),
          start_time: 1600,
          end_time: 1700,
          day: WeekdayEnum.FRI,
        },
      ],
    },
  ];

  const {
    personalScheduleModalIsOpen,
    setPersonalScheduleModalOpen,
    setEditMode,
    setAddMode,
  } = useTimetableStore(
    useShallow((state) => ({
      personalScheduleModalIsOpen: state.personalScheduleModalIsOpen,
      setPersonalScheduleModalOpen: state.setPersonalScheduleModalOpen,
      setEditMode: state.setEditMode,
      setAddMode: state.setAddMode,
    })),
  );

  const handleAddPersonalSchedule = () => {
    setPersonalScheduleModalOpen();
    setAddMode();
  };

  const handleEditPersonalSchedule = () => {
    setPersonalScheduleModalOpen();
    setEditMode();
  };

  return (
    <div className="flex h-full w-full flex-col gap-15 overflow-y-auto bg-white p-5">
      <div className="text-hsu flex items-center justify-between border-b pb-10 font-bold">
        <h2 className="max-sm:text-md text-xl max-md:text-lg">
          개인 스케줄 관리
        </h2>
        <button
          className={clsx(
            "max-sm:text-xxs rounded-xl px-10 py-5 text-sm font-semibold text-white max-md:text-xs",
            "hover:shadow-hsu/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg",
          )}
          style={{
            background: "linear-gradient(135deg, #2e5cb8 0%, #4472c4 100%)",
          }}
          onClick={handleAddPersonalSchedule}
        >
          개인 스케줄 추가
        </button>
      </div>
      <div className="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8">
        {schedules.map((personalSchedule, i) => (
          <PersonalScheduleCard
            key={personalSchedule.personal_schedule_id}
            personalSchedule={personalSchedule}
            index={i}
            handleEditPersonalSchedule={handleEditPersonalSchedule}
          />
        ))}
        <PersonalScheduleAddCard
          handleAddPersonalSchedule={handleAddPersonalSchedule}
        />
      </div>
      {personalScheduleModalIsOpen && <PersonalScheduleModal />}
      {/* <PersonalScheduleModal /> */}
    </div>
  );
}
