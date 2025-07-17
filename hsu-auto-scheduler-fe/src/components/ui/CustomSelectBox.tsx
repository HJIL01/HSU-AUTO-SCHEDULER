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
      onChange={(e) => console.log(e.target.value)}
      {...props}
    >
      <option value="sad">asdas</option>
      <option value="sadsad">asdas</option>
      <option value="sasdsadasde">asdas</option>
      <option value="sasdasdad">asdas</option>
    </select>
  );
}
