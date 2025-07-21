"use client";

import { WeekdayEnum } from "@/enums/weekday.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

export const TestSchema = z.object({
  test: z.enum(WeekdayEnum, { message: "enum이 아님" }),
});

export type TestSchemaType = z.infer<typeof TestSchema>;

export default function page() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useForm<TestSchemaType>({
    mode: "all",
    resolver: zodResolver(TestSchema),
  });

  console.log(errors?.["test"]);
  return (
    <div>
      <input
        type="text"
        className="h-50 w-50 border border-red-500 text-2xl"
        {...register("test")}
        onBlur={() => {
          setValue("test", WeekdayEnum.MON);
        }}
      />
    </div>
  );
}
