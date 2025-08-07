/* 
    타임 테이블을 받아서 겹치는 시간대가 있는지 확인을 해주는 함수
    zustand의 timeSelections에 직접 접근을 하지 않고 인자로 받아서 사용하는 이유는,
    개인 스케줄 업데이트 시 원본을 훼손하지 않으면서도 타임 셀렉션 내 일부를 수정 후 검사해야 하기 때문
    (업데이트 이전 시간대 삭제 후 새로운 시간대 검사)
*/

import { WeekdayEnum } from "@/enums/weekday.enum";
import { TimeSelectionsType } from "@/store/timetable/timeSelections.slice";

type Props = {
  timeSelections: TimeSelectionsType;
  day: WeekdayEnum;
  startIndex: number;
  endIndex: number;
};

export default function isOverlapTimeSelections({
  timeSelections,
  day,
  startIndex,
  endIndex,
}: Props): boolean {
  const dayTimes = timeSelections[day];

  for (let i = startIndex; i < endIndex; i++) {
    if (dayTimes[i]) {
      return true;
    }
  }

  return false;
}
