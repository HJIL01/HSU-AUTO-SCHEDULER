import { XMLParser } from "fast-xml-parser";
import { CourseType } from "../types/courseType";
import { formatClassInfo } from "./formatSession";

export function xmlToJson(xmlText: string) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    trimValues: true,
  });

  const jsonObj = parser.parse(xmlText);

  const rows = jsonObj.rows.row;

  /* 
        과목코드
        과목명
        이수 구분(전필, 전선, 복전선, 일선 등 이건 중요x)
        과목 구분(온라인100%, BL, 대면수업)
        학점
        주야
        분반
        학년
        학년 제한
        교수
        강의실 및 교시
  */
  const json: CourseType[] = rows.map((row) => ({
    courseCode: row.kwamokcode,
    courseName: row.kwamokname,
    completionType: row.isugubun,
    deliveryMethod: row.kwamok_gubun,
    credit: Number(row.hakjum),
    dayOrNight: row.juya,
    classSection: row.bunban,
    grade: Number(row.haknean),
    gradeLimit: row.haknean_limit || null,
    professor: row.prof,
    sessionInfoType: formatClassInfo(
      row.kwamok_gubun,
      Number(row.hakjum),
      row.classroom
    ),
  }));

  return json;
}
