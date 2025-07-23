import { getSemesters } from "@/api/getSemesters";
import { ReactNode } from "react";
import TimeTableHeader from "./timetable/_components/02_organisms/TimeTableHeader";

type Props = {
  children: ReactNode;
};

export default async function BeforeLoginLayout({ children }: Props) {
  const { data: semesters } = await getSemesters();

  return (
    <div className="mx-auto max-w-[80dvw]">
      <TimeTableHeader semesters={semesters} />
      <main className="w-full">{children}</main>
    </div>
  );
}
