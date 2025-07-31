import { CourseRenderInfoType } from "@/types/courseRenderInfo.type";
import { CourseType } from "@/types/schemas/Course.schema";

type Props = {
  onlineCourses: CourseType[];
};

export default function OnlineCourseListForCPSAT({ onlineCourses }: Props) {
  return (
    <div>
      {onlineCourses.map((onlineCourse) => (
        <div key={onlineCourse.course_id}></div>
      ))}
    </div>
  );
}
