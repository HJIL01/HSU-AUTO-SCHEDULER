// 강좌 하나의 장소, 시작 및 종료 시간 타입
export type SessionBlockType = {
  place: string;
  day: string;
  startTime: number;
  endTime: number;
};

// 강좌의 온라인과 오프라인 정보 타입
export type SessionInfoType = {
  online: number;
  offline: null | SessionBlockType[];
};

// 강좌 타입
export type CourseType = {
  courseCode: string; // 과목코드: string
  courseName: string; // 과목명: string
  completionType: string; // 이수 구분(전필, 전선, 복전선, 일선): string
  deliveryMethod: string; // 과목 구분(온라인100%, BL, 대면수업): string
  credit: number; // 학점: number
  dayOrNight: string; // 주야구분: string
  classSection: string; //분반: string
  grade: number; // 학년(1, 2, 3, 4학년 또는 전학년(0으로)): number
  gradeLimit: number | null; // 학년제한: number 또는 null
  professor: string; // 교수: string
  planCode: string | null; //강의 계획서 code string 또는 null
  sessionInfo: SessionInfoType | null; // 강의실 및 교시: 위의 sessionInfoType 또는 null
};

/* 
        과목코드 
        과목명
        이수 구분(전필, 전선, 복전선, 일선)
        과목 구분(온라인100%, BL, 대면수업)
        학점
        주야
        분반
        학년
        학년 제한
        교수
        강의 계획서
        강의실 및 교시
*/
