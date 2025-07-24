import SangSangBoogi from "@/assets/SangSangBoogi.webp";
import clsx from "clsx";
import Image from "next/image";
import { ComponentProps } from "react";

type Props = ComponentProps<"div">;

export default function SpinSangSangBoogi({ className }: Props) {
  return (
    <div className={clsx("animate-spin-sangsangboogi h-auto w-12", className)}>
      <Image src={SangSangBoogi} alt="상상부기" />
    </div>
  );
}
