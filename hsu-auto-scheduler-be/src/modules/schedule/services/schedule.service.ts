import { Injectable } from '@nestjs/common';
import { ConstraintsDto } from '../dto/constraints.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from 'src/common/entities/04_course.entity';
import { WeekdayEnum } from 'src/common/enums/weekday.enum';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { CourseDto } from 'src/common/dto/03_course.dto';
import { SemesterEntity } from 'src/common/entities/01_semester.entity';
import { MajorEntity } from 'src/common/entities/02_major.entity';
import { CourseFilteringQueryService } from './CourseFilteringQuery.service';
import { GetCoursesDto } from '../dto/getCourses.dto';

export type WeeklyScheduleType = {
  schedule_name: string;
  start_time: number;
  end_time: number;
};

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(SemesterEntity)
    private readonly semesterRepo: Repository<SemesterEntity>,

    @InjectRepository(MajorEntity)
    private readonly majorRepo: Repository<MajorEntity>,

    @InjectRepository(CourseEntity)
    private readonly courseRepo: Repository<CourseEntity>,

    private readonly httpService: HttpService,

    private readonly courseFilterQueryService: CourseFilteringQueryService,
  ) {}

  // 모든 학년-학기를 조회하는 함수
  async getSemesters() {
    const semesters = await this.semesterRepo.find();

    semesters.sort((a, b) => +b.semester_id - +a.semester_id);
    return {
      message: 'get semesters 성공',
      data: semesters,
    };
  }

  // 학기에 맞는 모든 전공을 가져오는 함수
  async getMajors(semesterId: string) {
    const majors = await this.majorRepo
      .createQueryBuilder('m')
      .leftJoinAndSelect('semester_major', 'sm', 'm.major_code = sm.major_code')
      .where('sm.semester_id = :semester_id', {
        semester_id: semesterId,
      })
      .getMany();

    return {
      message: 'get majors 성공',
      data: majors,
    };
  }

  // 필터에 맞는 모든 강의들을 가져오는 함수
  async getCourses(getCoursesCondition: GetCoursesDto) {
    const { currentPage, pagePerLimit, filters } = getCoursesCondition;

    const {
      semester_id,
      major_code,
      grade,
      day_or_night,
      no_class_days,
      personal_schedules,
      selected_courses,
      has_lunch_break,
    } = filters;

    const weeklyScheduleMap = new Map<WeekdayEnum, WeeklyScheduleType[]>();

    const courseRepoAlias = 'c';
    const majorCourseRepoAlias = 'mc';
    const offlineScheduleRepoAlias = 'os';

    const query = this.courseRepo
      .createQueryBuilder(courseRepoAlias)
      .leftJoinAndSelect(
        'major_course',
        majorCourseRepoAlias,
        `${majorCourseRepoAlias}.course_id = ${courseRepoAlias}.course_id`,
      )
      .leftJoinAndSelect(
        `${courseRepoAlias}.offline_schedules`,
        offlineScheduleRepoAlias,
        `${offlineScheduleRepoAlias}.course_id = ${courseRepoAlias}.course_id`,
      );

    // 학기는 필수 포함
    const semesterFilterQuery =
      this.courseFilterQueryService.getCoursesBySemester(
        courseRepoAlias,
        semester_id,
      );

    query.where(semesterFilterQuery.clause, semesterFilterQuery.params);

    // 선택한 전공 코드가 있을 시
    if (major_code) {
      const majorFilterQuery = this.courseFilterQueryService.getCoursesByMajor(
        majorCourseRepoAlias,
        major_code,
      );

      query.andWhere(majorFilterQuery.clause, majorFilterQuery.params);
    }

    // 선택한 학년이 있을 시
    if (grade) {
      const gradeFilterQuery = this.courseFilterQueryService.getCoursesByGrade(
        courseRepoAlias,
        grade,
      );

      query.andWhere(gradeFilterQuery.clause, gradeFilterQuery.params);
    }

    // 선택한 주야가 있을 시
    if (day_or_night) {
      const dayOrNightFilterQuery =
        this.courseFilterQueryService.getCoursesByDayOrNight(
          courseRepoAlias,
          day_or_night,
        );

      query.andWhere(
        dayOrNightFilterQuery.clause,
        dayOrNightFilterQuery.params,
      );
    }

    // 선택한 공강 요일이 있을 시
    if (no_class_days.length > 0) {
      const noClassDaysFilterQuery =
        this.courseFilterQueryService.getCoursesByNoClassDays(
          courseRepoAlias,
          no_class_days,
        );

      query.andWhere(
        noClassDaysFilterQuery.clause,
        noClassDaysFilterQuery.params,
      );
    }

    // 개인 스케줄이 있을 시
    if (personal_schedules.length > 0) {
      this.courseFilterQueryService.getCoursesByPersonalSchedulesFilter(
        personal_schedules,
        no_class_days,
        weeklyScheduleMap,
      );
    }

    // 미리 선택한 강의가 있을 시
    if (selected_courses.length > 0) {
      const preSelectedCourseFilterQuery =
        this.courseFilterQueryService.getCoursesByPreSelectedCourses(
          courseRepoAlias,
          selected_courses,
          weeklyScheduleMap,
        );

      query.andWhere(
        preSelectedCourseFilterQuery.clause,
        preSelectedCourseFilterQuery.params,
      );
    }

    // 1차로 필터링된 데이터
    let filteredCourses = await query.getMany();

    // weeklyScheduleMap에 포함되어 있는 시간대를 바탕으로 courses를 필터링
    filteredCourses =
      this.courseFilterQueryService.getCoursesFilterByWeeklySchedule(
        filteredCourses,
        weeklyScheduleMap,
      );

    // 점심 시간 포함이 true일시
    if (has_lunch_break) {
      filteredCourses =
        this.courseFilterQueryService.getCoursesByLunchTimeFilter(
          filteredCourses,
        );
    }

    // console.log(JSON.stringify(filteredCourses, null, 2));
    const paginationStart = (currentPage - 1) * pagePerLimit;
    const paginationEnd = paginationStart + pagePerLimit;

    filteredCourses = filteredCourses.slice(paginationStart, paginationEnd);

    return {
      message: 'get courses 성공',
      data: filteredCourses,
    };
  }

  async filterDataAndPostConstraints(constaraints: ConstraintsDto) {
    /* 
      SQL문으로 필터링 할 것들
      학기, 전공, 학년, 주야, 공강 요일, 미리 선택된 강의와 같은 과목코드의 강의,

      JS로 필터링 할 것들
      선택된 강의와 같은 시간의 강의,
      스케줄 시간대, 
      점심 true라면 점심 시간에 포함된 강의들
    */

    // 선택된 강의와 개인 스케줄을 요일 별로 묶을 Map
    const weeklyScheduleMap = new Map<WeekdayEnum, WeeklyScheduleType[]>();

    const courseRepoAlias = 'c';
    const majorCourseRepoAlias = 'mc';
    const offlineScheduleRepoAlias = 'os';

    // courseRepo에 offline_schedules를 엔티티 left 조인(객체에 포함시킴), major_course 일반 left 조인
    const query = this.courseRepo
      .createQueryBuilder(courseRepoAlias)
      .leftJoinAndSelect(
        'major_course',
        majorCourseRepoAlias,
        `${majorCourseRepoAlias}.course_id = ${courseRepoAlias}.course_id`,
      )
      .leftJoinAndSelect(
        `${courseRepoAlias}.offline_schedules`,
        offlineScheduleRepoAlias,
      );

    // 1. 학기 필터링
    const semesterFilterQuery =
      this.courseFilterQueryService.getCoursesBySemester(
        courseRepoAlias,
        constaraints.semester_id,
      );
    query.where(semesterFilterQuery.clause, semesterFilterQuery.params);

    // 2. 전공 코드 필터링
    const majorFilterQuery = this.courseFilterQueryService.getCoursesByMajor(
      majorCourseRepoAlias,
      constaraints.major_code,
    );
    query.andWhere(majorFilterQuery.clause, majorFilterQuery.params);

    // 3. 학년 필터링
    const gradeFilterQuery = this.courseFilterQueryService.getCoursesByGrade(
      courseRepoAlias,
      constaraints.grade,
    );
    query.andWhere(gradeFilterQuery.clause, gradeFilterQuery.params);

    // 4. 주야 필터링
    const dayOrNightFilterQuery =
      this.courseFilterQueryService.getCoursesByDayOrNight(
        courseRepoAlias,
        constaraints.day_or_night,
      );
    query.andWhere(dayOrNightFilterQuery.clause, dayOrNightFilterQuery.params);

    // 5. 공강 요일 필터링(선택된 공강 요일이 있을 시)
    if (constaraints.no_class_days.length > 0) {
      const noClassDaysFilterQuery =
        this.courseFilterQueryService.getCoursesByNoClassDays(
          courseRepoAlias,
          constaraints.no_class_days,
        );
      query.andWhere(
        noClassDaysFilterQuery.clause,
        noClassDaysFilterQuery.params,
      );
    }

    // 6. 미리 선택된 강의들의 강의 코드로 필터링
    if (constaraints.selected_courses.length > 0) {
      const preSelectedCourseFilterQuery =
        this.courseFilterQueryService.getCoursesByPreSelectedCourses(
          courseRepoAlias,
          constaraints.selected_courses,
          weeklyScheduleMap,
        );

      query.andWhere(
        preSelectedCourseFilterQuery.clause,
        preSelectedCourseFilterQuery.params,
      );
    }

    // 7. 개인 스케줄
    if (constaraints.personal_schedules.length > 0) {
      // 그냥 weeklyScheduleMap에 추가만 하는 것이므로 따로 추가적인 작업 없이 호출만
      this.courseFilterQueryService.getCoursesByPersonalSchedulesFilter(
        constaraints.personal_schedules,
        constaraints.no_class_days,
        weeklyScheduleMap,
      );
    }

    // 1차로 필터링된 데이터
    let filteredCourses = await query.getMany();

    // weeklyScheduleMap에 포함되어 있는 시간대를 바탕으로 courses를 필터링
    filteredCourses =
      this.courseFilterQueryService.getCoursesFilterByWeeklySchedule(
        filteredCourses,
        weeklyScheduleMap,
      );

    // 점심 시간 보장 제약이 true일 경우 강의의 시간이 점심 시간과 겹치는지 확인하는 로직
    if (constaraints.has_lunch_break) {
      filteredCourses =
        this.courseFilterQueryService.getCoursesByLunchTimeFilter(
          filteredCourses,
        );
    }

    // console.log(JSON.stringify(filteredCourses, null, 2));
    // console.log(filteredCourses.length);

    // 미리 선택된 강의들도 포함시키는 이유는 반드시 포함시켜서 연산해야할 제약조건(하루 최대 강의 수, 최대 학점, 전기, 전필, 전선 등)이 있기 때문
    const finalFilteredCourses: CourseDto[] = filteredCourses.reduce(
      (acc, cur) => {
        const courseDto: CourseDto = {
          semester_id: cur.semester_id,
          course_id: cur.course_id,
          course_code: cur.course_code,
          course_name: cur.course_name,
          professor_names: cur.professor_names,
          completion_type: cur.completion_type,
          delivery_method: cur.delivery_method,
          credit: cur.credit,
          day_or_night: cur.day_or_night,
          class_section: cur.class_section,
          grade: cur.grade,
          grade_limit: cur.grade_limit,
          online_hour: cur.online_hour,
          offline_schedules: cur.offline_schedules,
          plan_code: cur.plan_code,
        };

        acc.push(courseDto);
        return acc;
      },
      [...constaraints.selected_courses],
    );

    const response = await firstValueFrom(
      this.httpService.post(`${process.env.FAST_API_BASE_URL}/cp-sat`, {
        filtered_data: finalFilteredCourses,
        // 밑의 강의들은 무조건 포함되도록 하기 위해서 같이 보냄
        pre_selected_courses: constaraints.selected_courses,
        constraints: constaraints,
      }),
    );

    const { total_solution_count, solutions } = response.data;

    return {
      message: '필터링 및 제약 조건 추출 성공',
      data: {
        total_solution_count,
        solutions,
      },
    };
  }
}
