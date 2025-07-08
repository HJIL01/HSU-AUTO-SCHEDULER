import { XMLParser } from "fast-xml-parser";
import { CourseType } from "../types/courseType";
import { formatClassInfo } from "./formatSession";
import { parseDayOrNight } from "./parseStringToCode";
import { splitMajorCodeAndName } from "./splitMajorCodeAndName";
import { MajorType } from "types/majorType";

export function majorXmlToJson(majorMxlText: string) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    trimValues: true,
  });

  const jsonObj = parser.parse(majorMxlText);

  const items = jsonObj.root.items.item;

  const majors: MajorType[] = items.map((item: Record<string, string>) => ({
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

  // 해당 전공의 과목 데이터가 없다면 null을 반환
  if (!rows) {
    return null;
  }

  // 배열이 아닌 형식의 단 하나의 객체가 있는 경우가 있어서 반드시 배열로 만들어주는 로직
  const toArrayRows = Array.isArray(rows) ? rows : [rows];

  const courses: CourseType[] = toArrayRows.map(
    (row: Record<string, string>) => ({
      courseCode: row.kwamokcode,
      courseName: row.kwamokname,
      completionType: row.isugubun,
      deliveryMethod: row.kwamok_gubun,
      credit: Number(row.hakjum),
      dayOrNight: parseDayOrNight(row.juya),
      classSection: String(row.bunban),
      grade: isNaN(Number(row.haknean)) ? 0 : Number(row.haknean),
      gradeLimit: Number(row.haknean_limit) || null,
      professor: row.prof,
      planCode: row.plan || null,
      sessionInfo: formatClassInfo(
        row.kwamok_gubun,
        Number(row.hakjum),
        row.classroom
      ),
    })
  );

  return courses;
}
