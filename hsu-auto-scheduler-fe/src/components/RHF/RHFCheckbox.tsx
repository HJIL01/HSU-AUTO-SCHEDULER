"use client";

import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import { ComponentProps } from "react";
import { CustomInput } from "../ui/CustomInput";
import clsx from "clsx";

type Props<T extends FieldValues> = {
  id: string;
  name: Path<T>;
  labelText: string;
  className?: string;
  type?: string;
} & ComponentProps<"input">;

export default function RHFCheckbox<T extends FieldValues>({
  type,
  id,
  name,
  labelText,
  className,
  ...props
}: Props<T>) {
  const { control } = useFormContext<T>();

  return (
    <div className={clsx("flex gap-3", "text-xs")}>
      <label
        htmlFor={id}
        className={clsx(
          "inline-block whitespace-nowrap",
          "text-hsu text-xs font-semibold",
          "mb-2 ml-2",
        )}
      >
        {labelText}
      </label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <CustomInput
            {...field}
            type={type || "checkbox"}
            id={id}
            className={clsx("!h-7 !w-7", className)}
            {...props}
          />
        )}
      />
    </div>
  );
}
