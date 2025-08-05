import { OfflineScheduleType } from "@/types/schemas/OfflineSchedule.schema";
import { ChangeEvent, useEffect, useState } from "react";

type StartTimeType = {
  startHour: number;
  startMin: number;
};

type EndTimeType = {
  endHour: number;
  endMin: number;
};

type Props = {
  index: number;
  onChange: (
    index: number,
    fieldName: keyof OfflineScheduleType,
    value: OfflineScheduleType[keyof OfflineScheduleType],
  ) => void;
};

export default function useTimeRangeFields({ index, onChange }: Props) {
  const [startTime, setStartTime] = useState<StartTimeType>({
    startHour: 540,
    startMin: 0,
  });

  const [endTime, setEndTime] = useState<EndTimeType>({
    endHour: 600,
    endMin: 0,
  });

  const handleStartHour = (e: ChangeEvent<HTMLSelectElement>) => {
    setStartTime((prev) => ({
      ...prev,
      startHour: +e.target.value,
    }));
  };

  const handleStartMin = (e: ChangeEvent<HTMLSelectElement>) => {
    setStartTime((prev) => ({
      ...prev,
      startMin: +e.target.value,
    }));
  };

  const handleEndHour = (e: ChangeEvent<HTMLSelectElement>) => {
    setEndTime((prev) => ({
      ...prev,
      endHour: +e.target.value,
    }));
  };

  const handleEndMin = (e: ChangeEvent<HTMLSelectElement>) => {
    setEndTime((prev) => ({
      ...prev,
      endMin: +e.target.value,
    }));
  };

  useEffect(() => {
    const startTimeSum = startTime.startHour + startTime.startMin;
    const endTimeSum = endTime.endHour + endTime.endMin;

    if (startTimeSum > endTimeSum) {
      setEndTime({
        endHour: startTime.startHour + 60,
        endMin: 0,
      });
    }

    onChange(index, "start_time", startTimeSum);
  }, [startTime]);

  useEffect(() => {
    const startTimeSum = startTime.startHour + startTime.startMin;
    const endTimeSum = endTime.endHour + endTime.endMin;

    if (endTimeSum < startTimeSum) {
      setStartTime({
        startHour: endTime.endHour - 60,
        startMin: 0,
      });
    }

    onChange(index, "end_time", endTimeSum);
  }, [endTime]);

  return {
    startTime,
    endTime,
    handleStartHour,
    handleStartMin,
    handleEndHour,
    handleEndMin,
  };
}
