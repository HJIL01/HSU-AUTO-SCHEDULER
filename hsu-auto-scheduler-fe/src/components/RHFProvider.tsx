"use client";

import {
  CreateCPSATschema,
  createCPSATSchemaDefaultValues,
} from "@/types/schemas/CreateCPSAT.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";

type Props = {
  children: ReactNode;
};

export default function RHFProvider({ children }: Props) {
  const method = useForm({
    mode: "all",
    resolver: zodResolver(CreateCPSATschema),
    defaultValues: createCPSATSchemaDefaultValues,
  });

  return <FormProvider {...method}>{children}</FormProvider>;
}
