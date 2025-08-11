"use client";

import { SelectOptionType } from "@/types/selectOption.type";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import CustomSelectBox from "../ui/CustomSelectBox";
import useFocusState from "@/hooks/common/useFocusState";
type Props<T extends FieldValues> = {
  name: Path<T>;
  items: SelectOptionType[];
  placeholder: string;
  className?: string;
};

export default function RHFCustomSelect<T extends FieldValues>({
  name,
  items,
  placeholder,
  className,
}: Props<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const { onFocus, onBlur } = useFocusState();

  const handleOnBlurOverride = (RHFOnBlur: () => void) => {
    onBlur();
    RHFOnBlur();
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
            className={className}
            onFocus={onFocus}
            onBlur={() => handleOnBlurOverride(field.onBlur)}
          />
        )}
      />
      {errors[name] && (
        <p className="text-xxs pl-2 whitespace-nowrap text-red-600">
          {String(errors[name].message)}
        </p>
      )}
    </div>
  );
}
