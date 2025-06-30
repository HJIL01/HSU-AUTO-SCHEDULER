import { SessionInfoType } from "../types/courseType";

/* 
      요일과 시간의 문자열을 넣으면 분리하여 배열 형태로 return 하는 함수

      1. 문자열에서 모든 공백과 M문자 및 ~문자 제거 ex) 월 10M~11M -> 월11~12
      2. 첫번째 글자 slice로 day 구함
      3. "~"를 기준으로 split하여 시작 시간과 끝나는 시간을 구함
      4. [day, startTime, endTime]을 return
*/
function getDayAndTime(dayAndTime: string) {
  const replaced = dayAndTime.replace(/\s+|M/g, "");
  const day = dayAndTime[0];
  const [startTime, endTime] = replaced.slice(1).split("~");
  return [day, startTime, endTime];
}

/* 
  대면 수업 문자열을 input값으로 넣으면 배열 형태로 return하는 함수

  1. 모든 대면 수업을 /를 기준으로 나눈 후 모든 문자열 요소의 앞뒤의 공백 제거
  ex) 상상관406 목10~12M / 상상관507 금5~6M -> ["상상관406 목10~12M", "상상관507 금5~6M"]
  2. 장소는 하나인데 시간이 여러 번으로 나뉜 수업이 있을 수 있으므로 flatMap을 이용하여 포맷팅
  ex) ["낙산관102 월8M~9M,목5M~6M"] -> ["낙산관102 월8M~9M", "낙산관102 목5M~6M"]
  3. 공백을 기준으로 장소와 시간을 getDayAndTime 함수에 넣어서 배열 형태로 포맷팅
  ex) ["낙산관102 월8M~9M"] -> [["낙산관102", "월", "8", "9"]]
  4. 위에서 포맷한 배열의 모든 요소를 돌면서 offline 타입의 객체로 반환 
*/
function extractInPersonSchedule(inPersonSchedule: string) {
  const splitSchedules = inPersonSchedule.split("/").map((e) => e.trim());

  const matchSchedules = splitSchedules.flatMap((schedule) => {
    const [place, timeString] = schedule.split(" ");

    return timeString.split(",").map((time) => `${place} ${time}`);
  });

  const formatted = matchSchedules.map((schedule) => {
    const [place, timeString] = schedule.split(" ");

    return [place, ...getDayAndTime(timeString)];
  });

  return formatted.map((schedule) => ({
    place: schedule[0],
    day: schedule[1],
    startTime: 9 * 60 + (Number(schedule[2]) - 1) * 60,
    endTime: 9 * 60 + (Number(schedule[3]) - 1) * 60,
  }));
}

export function formatClassInfo(
  deliveryMethod: string,
  credit: number,
  classRoom: string
): SessionInfoType {
  // 먼저 모든 1개 이상의 공백들을 공백 하나로 치환
  classRoom = classRoom.replace(/\s+/g, " ");

  switch (deliveryMethod) {
    case "온라인100%": {
      return {
        online: credit,
        offline: null,
      };
    }
    case "대면수업": {
      const formattedSessionInfo = {
        online: 0,
        offline: extractInPersonSchedule(classRoom),
      };

      return formattedSessionInfo;
    }
    case "BL": {
      const [onlineString, ...offlineArray] = classRoom.split("/");

      const online = Number(onlineString.replace(/온라인강좌|시간/g, ""));
      const offlineString = offlineArray.join("/");

      return {
        online,
        offline: extractInPersonSchedule(offlineString),
      };
    }
    default: {
      return {
        online: 0,
        offline: null,
      };
    }
  }
}
