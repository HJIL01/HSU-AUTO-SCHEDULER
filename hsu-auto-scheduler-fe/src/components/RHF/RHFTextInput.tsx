"use client";

import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import { ComponentProps } from "react";
import { CustomInput } from "../ui/CustomInput";

type Props<T extends FieldValues> = {
  id: string;
  name: Path<T>;
  type?: string;
} & ComponentProps<"input">;

export default function RHFTextInput<T extends FieldValues>({
  type,
  id,
  name,
  ...props
}: Props<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();
  return (
    <div>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <CustomInput type={type || "text"} id={id} {...field} {...props} />
        )}
      />
      {errors[name] && (
        <p className="pl-2 text-red-600">{String(errors[name].message)}</p>
      )}
    </div>
  );
}
