// components/form/RHFSelectBox.tsx
"use client";

import { SelectOptionType } from "@/types/selectOption.type";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import CustomSelectBox from "../ui/CustomSelectBox";
import clsx from "clsx";
import { useState } from "react";

type Props<T extends FieldValues> = {
  name: Path<T>;
  items: SelectOptionType[];
  placeholder: string;
  className?: string;
  onChangeOverride?: (
    value: string,
    defaultOnChange: (...e: any[]) => void,
  ) => void;
};

export default function RHFCustomSelect<T extends FieldValues>({
  name,
  items,
  placeholder,
  className,
  onChangeOverride,
}: Props<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const [isFocus, setIsFocus] = useState<boolean>(false);

  const handleInputOnFocus = () => {
    setIsFocus(true);
  };

  const handleInputOnBlur = () => {
    setIsFocus(false);
  };

  return (
    <div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <CustomSelectBox
            {...field}
            items={items}
            placeholder={placeholder}
            className={clsx(
              "transition-colors duration-150",
              className,
              isFocus && "border-zinc-950",
            )}
            onFocus={handleInputOnFocus}
            onBlur={handleInputOnBlur}
            onChange={(e) => {
              if (onChangeOverride) {
                onChangeOverride(e.target.value, field.onChange);
              } else {
                field.onChange(e.target.value);
              }
            }}
          />
        )}
      />
      {errors[name] && (
        <p className="pl-2 whitespace-nowrap text-red-600">
          {String(errors[name].message)}
        </p>
      )}
    </div>
  );
}
