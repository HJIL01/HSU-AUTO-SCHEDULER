import getTimetableCellHeight from "./getTimetableCellHeight";

export function getTopByStartTime(startTime: number, isCPSATResult: boolean) {
  const timetableCellHeight = getTimetableCellHeight(isCPSATResult);

  /* 
    1. 강의 시작 시간에서 9시(540분)을 빼서 몇 시 시작인지 구하기(분 기준)
    2. 1분 당 몇 px인지 구하고, 위에서 구한 (분 * 1분당 px: 셀 하나의 높이 / 60분)을 하면 top을 구할 수 있음
  */
  const offsetTop = (startTime - 9 * 60) * (timetableCellHeight / 60);

  return offsetTop;
}
