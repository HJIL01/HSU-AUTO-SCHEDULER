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
  courseCode: string;
  courseName: string;
  completionType: string;
  deliveryMethod: string;
  credit: number;
  dayOrNight: string;
  classSection: number;
  grade: number;
  gradeLimit: number | null;
  professor: string;
  sessionInfo: null | SessionInfoType;
};
