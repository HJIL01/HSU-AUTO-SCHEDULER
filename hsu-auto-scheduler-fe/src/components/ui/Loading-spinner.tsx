import clsx from "clsx";
import { ComponentProps } from "react";

type Props = ComponentProps<"div">;

export default function LoadingSpinner({ className, ...props }: Props) {
  return (
    <div
      className={clsx(
        "animate-spinner aspect-square w-20 rounded-full border-4 border-gray-300 !border-t-transparent",
        className,
      )}
      {...props}
    />
  );
}
