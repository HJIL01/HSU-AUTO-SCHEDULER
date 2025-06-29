function getDayAndTime(dayAndTime: string) {
  /* 
      1. 문자열에서 모든 공백과 M문자 및 ~문자 제거 ex) 월 10M~11M -> 월11~12
      2. 첫번째 글자 slice로 day 구함
      3. "~"를 기준으로 split하여 시작 시간과 끝나는 시간을 구함
      4. [day, startTime, endTime]을 return
  */
  let replaced = dayAndTime.replace(/[\s]+|M/g, "");
  const day = dayAndTime[0];
  replaced = replaced.slice(1);
  const [startTime, endTime] = replaced.split("~");
  return [day, startTime, endTime];
}

function formatClassInfo(
  deliveryMethod: string,
  credit: number,
  classRoom: string
) {
  // 장소 여러군데도 있고 시간도 여러 시간일수도 있음
  // 상상관603 월4~5
  // 상상관603 월4~5 / 상상관702 목2M~3M
  // 상상관503 월2M~3M,목4~5
  // 온라인강좌 1시간 / 공학관309  금5~6M
  switch (deliveryMethod) {
    case "온라인100%": {
      return {
        online: credit,
        offline: null,
      };
    }
    case "대면수업": {
      const splitPlaceAndTime = classRoom.split("/");
      const formattedArray = splitPlaceAndTime
        .map((e) => e.trim().split(/\s+/))
        .map((e) => [e[0], ...getDayAndTime(e[1])]);

      const result = {
        online: 0,
        offline: formattedArray.map((e) => ({
          place: e[0],
          day: e[1],
          startTime: Number(e[2]) * 60,
          endTime: Number(e[3]) * 60,
        })),
      };

      console.log(result);
      return result;
    }
  }
}
