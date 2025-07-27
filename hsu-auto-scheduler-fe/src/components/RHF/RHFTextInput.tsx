"use client";

import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import { ComponentProps, FocusEvent, useState } from "react";
import { CustomInput } from "../ui/CustomInput";
import clsx from "clsx";

type Props<T extends FieldValues> = {
  id: string;
  name: Path<T>;
  labelText: string;
  fixValueFuncOnBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  className?: string;
  type?: string;
} & ComponentProps<"input">;

export default function RHFTextInput<T extends FieldValues>({
  type,
  id,
  name,
  labelText,
  fixValueFuncOnBlur,
  className,
  ...props
}: Props<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const [isFocus, setIsFocus] = useState<boolean>(false);

  const handleInputOnFocus = () => {
    setIsFocus(true);
  };

  // event를 받아서 onBlur에 넘겨주고, 상태 변경 처리
  const handleInputOnBlurOverride = (
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void,
    event: React.FocusEvent<HTMLInputElement>,
  ) => {
    if (fixValueFuncOnBlur) {
      fixValueFuncOnBlur(event);
    }

    onBlur(event);
    setIsFocus(false);
  };

  return (
    <div className="text-xs">
      <label
        htmlFor={id}
        className={clsx(
          "border-course-list-border bg-course-fileter-bg flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-[5px] transition-colors duration-150",
          isFocus && "border-zinc-950",
        )}
      >
        <span className="inline-block whitespace-nowrap">{labelText}</span>
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <CustomInput
              type={type || "text"}
              id={id}
              className={clsx("rounded-0 border-none !p-0", className)}
              onFocus={handleInputOnFocus}
              {...{
                ...field,
                onBlur: (e) => handleInputOnBlurOverride(field.onBlur, e),
              }}
              {...props}
            />
          )}
        />
      </label>
      {errors[name] && (
        <p className="pl-2 whitespace-nowrap text-red-600">
          {String(errors[name].message)}
        </p>
      )}
    </div>
  );
}
