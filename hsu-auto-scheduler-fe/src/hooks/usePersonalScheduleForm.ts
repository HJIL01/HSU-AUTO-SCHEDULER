import {
  createOfflineScheduleDefaultValue,
  OfflineScheduleType,
} from "@/types/schemas/OfflineSchedule.schema";
import { PersonalScheduleType } from "@/types/schemas/PersonalSchedule.schema";
import { SubmitHandler, useFieldArray, useFormContext } from "react-hook-form";
import useMarkPersonalSchedule from "./useMarkPersonalSchedule";

export default function usePersonalScheduleForm() {
  const { control, setValue, handleSubmit } =
    useFormContext<PersonalScheduleType>();
  const { append, fields, remove } = useFieldArray({
    control,
    name: "offline_schedules",
  });
  const { addPersonalScheduleAndMark } = useMarkPersonalSchedule();

  const onAppend = () => {
    append(createOfflineScheduleDefaultValue());
  };

  const onRemove = (index: number) => {
    if (fields.length === 1) {
      alert("개인 스케줄에는 최소 하나의 일정이 있어야 합니다!");
      return;
    }

    remove(index);
  };

  const onChange = (
    index: number,
    fieldName: keyof OfflineScheduleType,
    value: OfflineScheduleType[keyof OfflineScheduleType],
  ) => {
    setValue(`offline_schedules.${index}.${fieldName}`, value);
  };

  const onSubmit: SubmitHandler<PersonalScheduleType> = (data) => {
    addPersonalScheduleAndMark(data);
  };

  const submitHandler = handleSubmit(onSubmit);

  return { control, fields, onAppend, onRemove, onChange, submitHandler };
}
