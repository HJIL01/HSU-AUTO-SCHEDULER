import { ReactNode } from "react";
import TimeTableEditButton from "./timetable/_components/organisms/TimeTableEditButton";
import CourseFinder from "./timetable/_components/templates/CourseFinder";

type Props = {
  children: ReactNode;
};

export default async function BeforeLoginLayout({ children }: Props) {
  return (
    <>
      <main>{children}</main>
      <CourseFinder />
      <TimeTableEditButton />
    </>
  );
}
