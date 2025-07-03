import { XMLParser } from "fast-xml-parser";
import { CourseType } from "../types/courseType";
import { formatClassInfo } from "./formatSession";
import { parseDayOrNight } from "./parseStringToCode";
import { splitMajorCodeAndName } from "./splitMajorCodeAndName";

export function majorXmlToJson(majorMxlText: string) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    trimValues: true,
  });

  const jsonObj = parser.parse(majorMxlText);

  const items = jsonObj.root.items.item;

  const majors = items.map((item) => ({
    majorCode: item.tcd,
    majorName: splitMajorCodeAndName(item.tnm),
  }));

  return majors;
}

// 과목 정보들의 xml을 json으로 파싱해주는 함수
export function courseXmlToJson(courseXmlText: string) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    trimValues: true,
  });

  const jsonObj = parser.parse(courseXmlText);

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
  const courses: CourseType[] = rows.map((row) => ({
    courseCode: row.kwamokcode,
    courseName: row.kwamokname,
    completionType: row.isugubun,
    deliveryMethod: row.kwamok_gubun,
    credit: Number(row.hakjum),
    dayOrNight: parseDayOrNight(row.juya),
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

  return courses;
}
