import clsx from "clsx";
import { ComponentProps } from "react";

type Props = ComponentProps<"div">;

export default function CustomSkeleton({ className }: Props) {
  return (
    <div
      className={clsx(
        "h-100 w-90 animate-pulse rounded-lg bg-black/15",
        className,
      )}
    />
  );
}
