import getTimetableCellHeight from "./getTimetableCellHeight";

export function getBlockHeight(
  startTime: number,
  endTime: number,
  isCPSATResult: boolean,
) {
  const timetableCellHeight = getTimetableCellHeight(isCPSATResult);

  const totalCourseTime = endTime - startTime;

  const courseBlockHeight = totalCourseTime * (timetableCellHeight / 60);

  return courseBlockHeight + 1;
}
