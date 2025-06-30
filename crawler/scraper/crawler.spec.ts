import { test } from "@playwright/test";
import { xmlToJson } from "../utils/xmlToJson";
import { CourseType } from "../types/courseType";

/* 
  !!!!!!!!!
  나중에 반드시 일련의 과정을 유닛 단위로 테스트하도록 바꾸기
  !!!!!!!!!
 */

const YEAR_SEMESTER_CODE = "20251";
const MAJOR_CODE = "V024";

test("연도-학기 선택 -> 전공 선택 -> xml 파싱", async ({ page }) => {
  // 시간표 및 강의 계획서 홈페이지 접속
  await page.goto("https://info.hansung.ac.kr/jsp/haksa/siganpyo_aui.jsp");

  // 타겟 연도-학기 네트워크 요청이 성공했을 시
  const [year_semester_response] = await Promise.all([
    page.waitForResponse((res) => {
      const requestBody = res.request().postData();

      return (
        // 해당 학기의 모든 전공 리스트가 성공적으로 받아와졌고, 타겟 연도-학기가 맞을 시
        res.url() ===
          "https://info.hansung.ac.kr/jsp/haksa/siganpyo_aui_data.jsp?gubun=jungonglist" &&
        res.status() === 200 &&
        typeof requestBody === "string" &&
        requestBody.includes(`syearhakgi=${YEAR_SEMESTER_CODE}`)
      );
    }),
    page.locator("#yearhakgi").selectOption(YEAR_SEMESTER_CODE),
  ]);

  // 타겟 전공 네트워크 요청이 성공했을 시
  const [major_response] = await Promise.all([
    page.waitForResponse((res) => {
      const requestBody = res.request().postData();

      return (
        res.url() ===
          "https://info.hansung.ac.kr/jsp/haksa/siganpyo_aui_data.jsp" &&
        res.status() === 200 &&
        typeof requestBody === "string" &&
        requestBody.includes(`syearhakgi=${YEAR_SEMESTER_CODE}`) &&
        requestBody.includes(`sjungong=${MAJOR_CODE}`)
      );
    }),
    page.locator("#jungong").selectOption(MAJOR_CODE),
  ]);

  // 연도-학기 선택 시 응답받는 xml과 전공 선택 시 응답받는 xml을 text 형식으로 추출
  const [year_semester_xml, major_xml] = await Promise.all([
    year_semester_response.text(),
    major_response.text(),
  ]);

  const courses: CourseType[] = xmlToJson(major_xml);

  console.log(JSON.stringify(courses, null, 2));
});
