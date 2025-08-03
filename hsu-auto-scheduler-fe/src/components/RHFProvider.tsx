"use client";

import {
  CreateCPSATschema,
  createCPSATSchemaDefaultValues,
} from "@/types/schemas/CreateCPSAT.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";

type Props = {
  children: ReactNode;
};

export default function RHFProvider({ children }: Props) {
  const { semester: currentSemester } = useParams();
  // app/shop/[...slug]/page.js처럼 Catch-all 라우트가 존재하기 때문에 useParams의 param은 string | string[] | undefined임
  // semester는 string인데 defaultSemester의 타입으로 인한 타입 에러 때문에 배열인지 아닌지 체크하는 타입 가드 사용
  const defaultSemester = Array.isArray(currentSemester)
    ? currentSemester[0]
    : (currentSemester ?? "2025-2");

  const { semester: _, ...rest } = createCPSATSchemaDefaultValues;

  const method = useForm({
    mode: "all",
    resolver: zodResolver(CreateCPSATschema),
    defaultValues: { semester: defaultSemester, ...rest },
  });

  return <FormProvider {...method}>{children}</FormProvider>;
}
