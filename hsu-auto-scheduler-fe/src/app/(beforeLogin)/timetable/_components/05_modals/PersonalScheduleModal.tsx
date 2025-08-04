"use client";

import Portal from "@/components/Portal";
import clsx from "clsx";
import { useShallow } from "zustand/shallow";
import { FormProvider, useForm } from "react-hook-form";
import {
  createPersonalScheduleDefaultValue,
  PersonalScheduleSchema,
  PersonalScheduleType,
} from "@/types/schemas/PersonalSchedule.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import PersonalScheduleModalForm from "./_components/PersonalScheduleModalForm";
import { useTimetableStore } from "@/store/timetable/timetableStore";

export default function PersonalScheduleModal() {
  const { setPersonalScheduleModalClose, mode } = useTimetableStore(
    useShallow((state) => ({
      setPersonalScheduleModalClose: state.setPersonalScheduleModalClose,
      mode: state.mode,
    })),
  );

  const methods = useForm<PersonalScheduleType>({
    mode: "all",
    resolver: zodResolver(PersonalScheduleSchema),
    defaultValues: createPersonalScheduleDefaultValue(),
  });

  return (
    <Portal>
      <div
        className={clsx(
          "fixed top-0 z-(--z-index-CPSATResult-modal) h-dvh w-dvw bg-black/30",
          "flex items-center justify-center",
        )}
        onClick={setPersonalScheduleModalClose}
      >
        <FormProvider {...methods}>
          <PersonalScheduleModalForm
            setPersonalScheduleModalClose={setPersonalScheduleModalClose}
            mode={mode}
          />
        </FormProvider>
      </div>
    </Portal>
  );
}
