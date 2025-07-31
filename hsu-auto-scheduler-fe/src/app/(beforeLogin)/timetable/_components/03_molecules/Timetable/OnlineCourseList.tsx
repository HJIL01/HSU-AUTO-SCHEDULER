"use client";

import { CourseType } from "@/types/schemas/Course.schema";

type Props = {
  onlineCourses: CourseType[];
};

export default function OnlineCourseList({ onlineCourses }: Props) {
  console.log(onlineCourses);
  return <div></div>;
}
