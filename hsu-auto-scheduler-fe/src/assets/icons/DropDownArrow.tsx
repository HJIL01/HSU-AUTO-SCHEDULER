import { ComponentProps } from "react";

type Props = ComponentProps<"svg">;

export default function DropDownArrow({ width = 10, ...props }: Props) {
  return (
    <svg
      width={width}
      height={width}
      viewBox="0 0 10 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1 1L5 5L9 1"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}
