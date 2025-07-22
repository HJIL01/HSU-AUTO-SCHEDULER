import { ReactNode } from "react";
import TimeTableEditButton from "./timetable/_components/02_organisms/TimeTableEditButton";
import CourseFinder from "./timetable/_components/01_templates/CourseFinder";

type Props = {
  children: ReactNode;
};

export default async function BeforeLoginLayout({ children }: Props) {
  return (
    <>
      <main className="flex max-h-dvh justify-center overflow-y-auto">
        {children}
      </main>
      <CourseFinder />
      <TimeTableEditButton />
    </>
  );
}
