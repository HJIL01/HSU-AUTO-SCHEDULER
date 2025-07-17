"use client";

import { defaultValues, schema } from "@/types/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";

type Props = {
  children: ReactNode;
};

export default function RHFProvider({ children }: Props) {
  const method = useForm({
    mode: "all",
    resolver: zodResolver(schema),
    defaultValues,
  });
  return <FormProvider {...method}>{children}</FormProvider>;
}
