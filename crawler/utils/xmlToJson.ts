import { XMLParser } from "fast-xml-parser";
import { CourseType } from "../types/course.type";
import { formatClassInfo } from "./formatSession";
import { parseDayOrNight } from "./parseStringToCode";
import { splitMajorCodeAndName } from "./splitMajorCodeAndName";
import { MajorType } from "types/major.type";
import { SessionInfoType } from "types/session-info.type";

export function majorXmlToJson(majorMxlText: string): MajorType[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    trimValues: true,
  });

  const jsonObj = parser.parse(majorMxlText);

  const items = jsonObj.root.items.item;

  const majors: MajorType[] = items.map((item: Record<string, string>) => ({
    major_code: item.tcd,
    major_name: splitMajorCodeAndName(item.tnm),
  }));

  return majors;
}

// 과목 정보들의 xml을 json으로 파싱해주는 함수
export function courseXmlToJson(
  semester_id: string,
  courseXmlText: string
): CourseType[] | null {
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

  const courses: CourseType[] = toArrayRows.map((row) => {
    const sessionInfo: SessionInfoType | null = formatClassInfo(
      row.kwamok_gubun,
      +row.hakjum,
      row.classroom
    );

    return {
      semester_id,
      course_id: `${semester_id}-${row.kwamokcode}-${String(row.bunban)}`,
      course_code: row.kwamokcode,
      course_name: row.kwamokname,
      professor_names: row.prof.split(","),
      completion_type: row.isugubun,
      delivery_method: row.kwamok_gubun,
      credit: +row.hakjum,
      day_or_night: parseDayOrNight(row.juya),
      class_section: String(row.bunban),
      grade: isNaN(+row.haknean) ? 0 : +row.haknean,
      grade_limit: row.haknean_limit || null,
      online_min: sessionInfo?.online || 0,
      offline_schedules: sessionInfo?.offline_schedules || null,
      plan_code: row.plan || null,
    };
  });

  return courses;
}
