"use client";

import { ComponentProps } from "react";

type Props<T> = {
  items: T[];
  name: string;
} & ComponentProps<"select">;

export default function CustomSelectBox<T>({
  items,
  name,
  ...props
}: Props<T>) {
  return (
    <select
      name={name}
      className="rounded-lg bg-white px-3 text-xs"
      onChange={(e) => console.log(e.target.value)}
      {...props}
    >
      <option value="sad">2025년 1학기</option>
      <option value="sadsad">asdas</option>
      <option value="sasdsadasde">asdas</option>
      <option value="sasdasdad">asdas</option>
    </select>
  );
}
