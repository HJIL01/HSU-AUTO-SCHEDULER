import { ReactNode } from "react";
import TimeTableEditButton from "./timetable/_components/Organisms/TimeTableEditButton";
import CourseList from "./timetable/_components/Templates/CourseList";

type Props = {
  children: ReactNode;
};

export default async function BeforeLoginLayout({ children }: Props) {
  return (
    <>
      <main>{children}</main>
      <CourseList />
      <TimeTableEditButton />
    </>
  );
}
