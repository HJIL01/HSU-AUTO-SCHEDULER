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
        "h-16 w-full",
        "shrink-0 truncate",
        "bg-light-hsu cursor-pointer rounded-lg px-3 py-[5px] text-xs",
        "border-border-hsu border-2 transition-all duration-200",
        "placeholder:text-gray-500",
        "focus:border-hsu",
        className,
      )}
      id={id}
      name={name}
      {...props}
    />
  );
});

CustomInput.displayName = "CustomInput";
