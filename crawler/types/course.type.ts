import { DayOrNightEnum } from "./day-or-night.enum";
import { OfflineScheduleType } from "./offline-schedule.type";

// 강좌 타입
export type CourseType = {
  semester_id: string; // 학기 아이디: string
  course_id: string; // 과목 식별자: 학기 아이디, 과목코드, 분반으로 이루어진 식별자
  course_code: string; // 과목코드: string
  course_name: string; // 과목명: string
  professor_names: string[]; // 교수 이름: string 배열
  completion_type: string; // 이수 구분(전필, 전선, 복전선, 일선): string
  delivery_method: string; // 과목 구분(온라인100%, BL, 대면수업): string
  credit: number; // 학점: number
  day_or_night: DayOrNightEnum; // 주야구분: enum
  class_section: string; //분반: string
  grade: number; // 학년(1, 2, 3, 4학년 또는 전학년(0으로)): number
  grade_limit: string | null; // 학년 제한: string 또는 null
  online_min: number; // 온라인 시간: number
  offline_schedules: OfflineScheduleType[] | null;
  plan_code: string | null; //강의 계획서 code string 또는 null
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
