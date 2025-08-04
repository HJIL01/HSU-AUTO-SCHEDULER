"use client";

import Portal from "@/components/Portal";
import { usePersonalScheduleStore } from "@/store/PersonalSchedule/personalScheduleStore";
import clsx from "clsx";
import { useShallow } from "zustand/shallow";
import PersonalScheduleModalHeader from "./_components/PersonalScheduleModalHeader";
import PersonalScheduleModalBody from "./_components/PersonalScheduleModalBody";
import PersonalScheduleModalFooter from "./_components/PersonalScheduleModalFooter";
import { FormProvider, useForm } from "react-hook-form";
import {
  PersonalScheduleSchema,
  PersonalScheduleType,
} from "@/types/schemas/PersonalSchedule.schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function PersonalScheduleModal() {
  const { setClose, mode } = usePersonalScheduleStore(
    useShallow((state) => ({
      setClose: state.setClose,
      mode: state.mode,
    })),
  );

  const methods = useForm<PersonalScheduleType>({
    mode: "all",
    resolver: zodResolver(PersonalScheduleSchema),
  });

  return (
    <Portal>
      <div
        className={clsx(
          "fixed top-0 z-(--z-index-CPSATResult-modal) h-dvh w-dvw bg-black/30",
          "flex items-center justify-center",
        )}
        onClick={setClose}
      >
        <FormProvider {...methods}>
          <form
            className="w-[90dvw] max-w-300 overflow-hidden rounded-3xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <PersonalScheduleModalHeader mode={mode} setClose={setClose} />
            <PersonalScheduleModalBody />
            <PersonalScheduleModalFooter />
          </form>
        </FormProvider>
      </div>
    </Portal>
  );
}
