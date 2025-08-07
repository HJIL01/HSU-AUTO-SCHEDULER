"use client";

import Portal from "@/components/Portal";
import clsx from "clsx";
import { FormProvider, useForm } from "react-hook-form";
import {
  createPersonalScheduleDefaultValue,
  PersonalScheduleSchema,
  PersonalScheduleType,
} from "@/types/schemas/PersonalSchedule.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import PersonalScheduleModalForm from "./_components/PersonalScheduleModalForm";

export default function PersonalScheduleModal() {
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
      >
        <FormProvider {...methods}>
          <PersonalScheduleModalForm />
        </FormProvider>
      </div>
    </Portal>
  );
}
