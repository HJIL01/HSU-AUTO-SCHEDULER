import { test } from "@playwright/test";
import { courseXmlToJson, majorXmlToJson } from "../utils/xmlToJson";
import { CourseType } from "../types/course.type";
import { MajorType } from "../types/major.type";
import { randomDelay } from "../utils/randomDelay";
import { logError } from "utils/logError";
import { splitSemester } from "utils/splitSemester";
import { SemesterType } from "types/semester.type";
import { postCourseData } from "apis/postCourseData";
import { postSemesterData } from "apis/postSemesterData";
import { postMajorData } from "apis/postMajorData";

const TEST_FUNC_TIME_OUT = 1000 * 60 * 5;
const semester: SemesterType = splitSemester("2025-1");
const MAJOR_CODE = "V024";

test("해당 학기의 모든 전공 가져오기 -> 전공 하나하나의 모든 강좌 가져오기 -> 데베 저장", async ({
  page,
}) => {
  // 테스트 함수 타임아웃 2분으로 정의
  test.setTimeout(TEST_FUNC_TIME_OUT);

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
        requestBody.includes(`syearhakgi=${semester.semester_id}`)
      );
    }),
    page.locator("#yearhakgi").selectOption(semester.semester_id),
  ]);

  // 해당 학기의 모든 전공들을 받아옴
  const majorsXml = await majors_response.text();

  const majors: MajorType[] = majorXmlToJson(majorsXml);

  const postSemesterRes = await postSemesterData(semester);
  // console.log(postSemesterRes);

  const postMajorRes = await postMajorData(semester.semester_id, majors);
  // console.log(postMajorRes);

  // 모든 전공들을 루프하면서 데이터베이스에 포맷된 정보를 기반으로 저장
  for (const index in majors) {
    const major = majors[index];
    const majorCode = major.major_code;
    const majorName = major.major_name;
    // const majorCode = MAJOR_CODE;

    try {
      // 전공들의 강좌들을 하나하나 받아오는 로직
      const [courses_response] = await Promise.all([
        page.waitForResponse((res) => {
          const requestBody = res.request().postData();

          return (
            res.url() ===
              "https://info.hansung.ac.kr/jsp/haksa/siganpyo_aui_data.jsp" &&
            res.status() === 200 &&
            typeof requestBody === "string" &&
            requestBody.includes(`syearhakgi=${semester.semester_id}`) &&
            requestBody.includes(`sjungong=${majorCode}`)
          );
        }),
        page.locator("#jungong").selectOption(majorCode),
      ]);

      const coursesXml = await courses_response.text();

      const courses: CourseType[] | null = courseXmlToJson(
        semester.semester_id,
        coursesXml
      );
      console.log(JSON.stringify(courses, null, 2));

      const res = await postCourseData(semester, major, courses);
      console.log(
        `${index}번째, ${majorName}(${majorCode}) 데이터 전송 완료`,
        res
      );

      // 너무 빨리 돌면 과부하 걸릴까봐 랜덤 딜레이 주기
      // await randomDelay();
    } catch (error) {
      // error 타입은 unknown 타입으로 처리되므로 message에 접근하기 위해 Error로 타입 단언을 사용한다.
      // 다른 방법은 Error 객체가 아닐 시를 대비하여 if(error instanceof Error)로 타입 가드를 사용하는 방법이 있다.
      const err = error as Error;
      console.error(
        `${index}번째 전공 전공이름: ${majorName} 전공코드: ${majorCode}에서 에러`,
        err.message
      );
      await logError(Number(index), major, err.message);
    }
  }
});
