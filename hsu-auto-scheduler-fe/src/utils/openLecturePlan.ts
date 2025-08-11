import isMobileDevice from "./isMobileDevice";

export default function openLecturePlan(planCode: string) {
  const isMobile = isMobileDevice();

  const width = window.innerWidth * (isMobile ? 1 : 0.9);
  const height = window.innerHeight * 0.9;

  window.open(
    `https://info.hansung.ac.kr/fuz/professor/lecturePlan/suupplan_main_view.jsp?code=${planCode}`,
    "_blank",
    `width=${width},height=${height},top=0,left=500`,
  );
}
