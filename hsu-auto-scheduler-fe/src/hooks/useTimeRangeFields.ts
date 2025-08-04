import { WeekdayEnum } from "@/enums/weekday.enum";
import {
  OfflineScheduleSchema,
  OfflineScheduleType,
} from "@/types/schemas/OfflineSchedule.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type StartTimeType = {
  startHour: number;
  startMin: number;
};

type EndTimeType = {
  endHour: number;
  endMin: number;
};

export default function useTimeRangeFields() {
  const { register, setValue, watch } = useForm<OfflineScheduleType>({
    mode: "all",
    resolver: zodResolver(OfflineScheduleSchema),
    defaultValues: {
      day: WeekdayEnum.MON,
      start_time: 540,
      end_time: 600,
    },
  });

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

    setValue("start_time", startTimeSum);
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

    setValue("end_time", endTimeSum);
  }, [endTime]);

  return {
    register,
    startTime,
    endTime,
    handleStartHour,
    handleStartMin,
    handleEndHour,
    handleEndMin,
  };
}
