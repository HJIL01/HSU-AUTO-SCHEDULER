"use client";

import { ComponentProps } from "react";

type Props = {
  items: { value: string; label: string }[];
  name: string;
} & ComponentProps<"select">;

export default function CustomSelectBox({ items, name, ...props }: Props) {
  return (
    <select name={name} className="rounded-lg bg-white px-3 text-xs" {...props}>
      {items.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
}
