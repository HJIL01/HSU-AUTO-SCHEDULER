"use client";

import usePersonalScheduleForm from "@/hooks/usePersonalScheduleForm";
import PersonalScheduleModalBody from "./PersonalScheduleModalBody";
import PersonalScheduleModalFooter from "./PersonalScheduleModalFooter";
import PersonalScheduleModalHeader from "./PersonalScheduleModalHeader";

type Props = {
  setPersonalScheduleModalClose: () => void;
  mode: "edit" | "add";
};

export default function PersonalScheduleModalForm({
  setPersonalScheduleModalClose,
  mode,
}: Props) {
  const { control, fields, onAppend, onRemove, onChange, submitHandler } =
    usePersonalScheduleForm();

  return (
    <form
      className="w-[90dvw] max-w-300 overflow-hidden rounded-3xl bg-white"
      onClick={(e) => e.stopPropagation()}
      onSubmit={submitHandler}
    >
      <PersonalScheduleModalHeader
        mode={mode}
        setPersonalScheduleModalClose={setPersonalScheduleModalClose}
      />
      <PersonalScheduleModalBody
        control={control}
        fields={fields}
        onAppend={onAppend}
        onRemove={onRemove}
        onChange={onChange}
      />
      <PersonalScheduleModalFooter
        setPersonalScheduleModalClose={setPersonalScheduleModalClose}
      />
    </form>
  );
}
