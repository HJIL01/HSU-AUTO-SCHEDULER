// 분을 HOURS의 인덱스로 변환해주는 함수
// 9시(0) = 540분
// 10시(1) = 600분

export default function getHourIndexFromMins(mins: number) {
  return (mins - 60 * 9) / 60;
}
