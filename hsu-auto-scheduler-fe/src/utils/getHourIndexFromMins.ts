// 분을 5분 단위의 인덱스로 계산해주는 함수
// 9시(0) = 540분
// 10시(1) = 600분

export default function calcMinIndex(mins: number) {
  return (mins - 60 * 9) / 5;
}
