"use client";

import clsx from "clsx";
import { ComponentProps, forwardRef } from "react";

export const CustomInput = forwardRef<
  HTMLInputElement,
  ComponentProps<"input"> & { name: string; id: string }
>(({ type, name, id, className, ...props }, ref) => {
  // 이름과 아이디는 필수값임
  return (
    <input
      type={type || "text"}
      ref={ref}
      className={clsx(
        "border-course-list-border h-fit w-full cursor-pointer rounded-lg border px-3 py-[5px] text-xs placeholder:text-gray-500",
        className,
      )}
      id={id}
      name={name}
      {...props}
    />
  );
});

CustomInput.displayName = "CustomInput";
