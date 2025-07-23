"use client";

import CourseFilters from "../03_molecules/CourseFilters";
import CourseList from "../03_molecules/CourseList";

export default function CourseFinder() {
  return (
    <section className="flex-1 bg-white max-sm:fixed max-sm:bottom-0 max-sm:z-50 max-sm:h-[50dvh] max-sm:w-[80dvw]">
      <CourseFilters />
      <CourseList />
    </section>
  );
}
