import z from "zod";

export const schema = z.object({
  semester_id: z.string().min(1, { message: "학기를 선택해주세요!" }),
});

export type SchemaType = z.infer<typeof schema>;

export const defaultValues: SchemaType = {
  semester_id: "2025-2",
};
