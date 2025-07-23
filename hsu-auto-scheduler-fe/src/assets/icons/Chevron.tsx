import clsx from "clsx";
import { ComponentProps } from "react";

type Props = ComponentProps<"svg"> & {
  className?: string;
};

export default function Chevron({ className, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("aspect-square w-25", className)}
      {...props}
    >
      <path
        d="M14.5 17L9.5 12L14.5 7"
        stroke="#000000"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
