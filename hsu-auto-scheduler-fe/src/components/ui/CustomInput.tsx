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
        "bg-light-hsu h-fit w-full cursor-pointer rounded-lg px-3 py-[5px] text-xs placeholder:text-gray-500",
        "border-border-hsu border-2 transition-all duration-200",
        className,
      )}
      id={id}
      name={name}
      {...props}
    />
  );
});

CustomInput.displayName = "CustomInput";
