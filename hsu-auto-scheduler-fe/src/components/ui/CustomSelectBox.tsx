"use client";

import { SelectOptionType } from "@/types/selectOption.type";
import clsx from "clsx";
import { ComponentProps } from "react";

type Props = {
  items: SelectOptionType[];
  name: string;
  placeholder?: string;
  className?: string;
} & ComponentProps<"select">;

export default function CustomSelectBox({
  items,
  name,
  placeholder,
  className,
  ...props
}: Props) {
  return (
    <select
      name={name}
      className={clsx(
        "h-16 px-4",
        "bg-light-hsu text-xs",
        "border-border-hsu rounded-lg border-2",
        "transition-all duration-200",
        "cursor-pointer",
        "focus:border-deep-hsu focus:shadow-[0_0_0_3px_rgba(68,114,196,0.1)]",
        className,
      )}
      {...props}
    >
      <option value="" disabled hidden>
        {placeholder}
      </option>
      {items.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
}
