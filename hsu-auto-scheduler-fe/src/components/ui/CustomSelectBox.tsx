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
      className={clsx("h-fit rounded-lg bg-white px-3 py-2 text-xs", className)}
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
