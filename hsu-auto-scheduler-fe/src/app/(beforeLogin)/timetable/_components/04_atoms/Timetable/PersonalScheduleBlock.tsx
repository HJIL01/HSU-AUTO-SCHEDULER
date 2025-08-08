"use client";

import CloseIcon from "@/assets/icons/CloseIcon";
import Edit from "@/assets/icons/Edit";
import { PERSONAL_SCHEDULE_BLOCK_BG_COLORS } from "@/constants/PersonalScheduleBlockBgColors";
import useCurrentSemester from "@/hooks/useCurrentSemester";
import useHoverState from "@/hooks/useHoverState";
import usePersonalScheduleModal from "@/hooks/usePersonalScheduleModal";
import useUnmarkPersonalSchedule from "@/hooks/useUnmarkPersonalSchedule";
import { PersonalScheduleRenderInfoType } from "@/types/personalScheduleRender.type";
import clsx from "clsx";

type Props = {
  personalScheduleRenderInfo: PersonalScheduleRenderInfoType;
  isCPSATResult: boolean;
};

export default function PersonalScheduleBlock({
  personalScheduleRenderInfo,
  isCPSATResult,
}: Props) {
  const currentSemester = useCurrentSemester();
  const { isHovered, onMouseEnter, onMouseLeave } = useHoverState();

  const { deletePersonalScheduleAndUnMark } = useUnmarkPersonalSchedule();
  const { handleEditPersonalSchedule } = usePersonalScheduleModal();

  const isHoverEnabled = !isCPSATResult;

  const handleEdit = () => {
    handleEditPersonalSchedule(personalScheduleRenderInfo.personalScheduleId);
  };

  const handleDelete = (
    targetPersonalScheduleId: string,
    personalScheduleName: string,
  ) => {
    deletePersonalScheduleAndUnMark(
      targetPersonalScheduleId,
      personalScheduleName,
    );
  };

  return (
    <div
      className={clsx(
        "border-y-scheduler-cell-border absolute top-0 z-(--z-index-schedule-block) w-full overflow-hidden border-y max-md:p-2",
        PERSONAL_SCHEDULE_BLOCK_BG_COLORS[
          personalScheduleRenderInfo.colorIndex
        ],
        isCPSATResult ? "p-2" : "p-4",
      )}
      style={{
        top: `${personalScheduleRenderInfo.top}px`,
        height: `${personalScheduleRenderInfo.height}px`,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isHovered && isHoverEnabled && (
        <div className="float-right mr-1 flex gap-1">
          <button
            className="aspect-square w-7 bg-transparent max-md:w-5"
            onClick={handleEdit}
          >
            <Edit />
          </button>
          <button
            className="aspect-square w-7 bg-transparent max-md:w-5"
            onClick={() =>
              handleDelete(
                personalScheduleRenderInfo.personalScheduleId,
                personalScheduleRenderInfo.personalScheduleName,
              )
            }
          >
            <CloseIcon />
          </button>
        </div>
      )}
      <h2
        className={clsx(
          "max-md:text-xxs font-extrabold max-lg:text-xs",
          isCPSATResult ? "text-xxs" : "text-sm",
        )}
      >
        {personalScheduleRenderInfo.personalScheduleName}
      </h2>

      <p
        className={clsx(
          "max-md:text-xxs max-md:flex-col",
          isCPSATResult ? "text-xxs" : "text-xs",
        )}
      >
        {personalScheduleRenderInfo.offlineSchedule?.place}
      </p>
    </div>
  );
}
