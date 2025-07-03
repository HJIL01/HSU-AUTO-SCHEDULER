import { test } from "@playwright/test";
import { courseXmlToJson, majorXmlToJson } from "../utils/xmlToJson";
import { CourseType } from "../types/courseType";
import { MajorType } from "../types/majorType";
import { randomDelay } from "../utils/randomDelay";

const YEAR_SEMESTER_CODE = "20251";
const MAJOR_CODE = "V024";

test("해당 학기의 모든 전공 가져오기 -> 전공 하나하나의 모든 강좌 가져오기 -> 데베 저장", async ({
  page,
}) => {
  // 시간표 및 강의 계획서 홈페이지 접속
  await page.goto("https://info.hansung.ac.kr/jsp/haksa/siganpyo_aui.jsp");

  // 타겟 연도-학기 네트워크 요청이 성공했을 시
  const [majors_response] = await Promise.all([
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

  // 해당 학기의 모든 전공들을 받아옴
  const majorsXml = await majors_response.text();

  const majors: MajorType[] = majorXmlToJson(majorsXml);

  // 이건 원본이 너무 많아서 3개까지만 자른거임
  const test = majors.slice(0, 3);

  // 모든 전공들을 루프하면서 데이터베이스에 포맷된 정보를 기반으로 저장
  // 지금은 console.log를 찍지만 나중에 데베 연동 시킬거임
  for (const major of test) {
    const majorCode = major.majorCode;

    // 전공들의 강좌들을 하나하나 받아오는 로직
    const [courses_response] = await Promise.all([
      page.waitForResponse((res) => {
        const requestBody = res.request().postData();

        return (
          res.url() ===
            "https://info.hansung.ac.kr/jsp/haksa/siganpyo_aui_data.jsp" &&
          res.status() === 200 &&
          typeof requestBody === "string" &&
          requestBody.includes(`syearhakgi=${YEAR_SEMESTER_CODE}`) &&
          requestBody.includes(`sjungong=${majorCode}`)
        );
      }),
      page.locator("#jungong").selectOption(majorCode),
    ]);

    const coursesXml = await courses_response.text();

    const courses: CourseType[] = courseXmlToJson(coursesXml);
    console.log(courses);

    // 너무 빨리 돌면 과부하 걸릴까봐 랜덤 딜레이 주기
    await randomDelay();
  }
});
