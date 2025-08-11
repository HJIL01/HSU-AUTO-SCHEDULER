// useResponsiveContext가 있음에도 해당 유틸 함수를 사용하는 이유는 리액트의 상태 생명주기와는 무관하게 사용하기 위함
export default function isMobileDevice(): boolean {
  return (
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0)
  );
}
