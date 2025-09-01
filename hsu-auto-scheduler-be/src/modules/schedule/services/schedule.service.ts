import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WeekdayEnum } from 'src/common/enums/weekday.enum';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { CourseDto } from 'src/common/dto/03_course.dto';
import { SemesterEntity } from 'src/common/entities/01_semester.entity';
import { MajorEntity } from 'src/common/entities/02_major.entity';
import { CourseFilteringQueryService } from './CourseFilteringQuery.service';
import { GetCoursesDto } from '../dto/getCourses.dto';
import { GetCPSATResultDto } from '../dto/getCPSATResult.dto';
import { ClassSectionEntity } from 'src/common/entities/05_classSection.entity';

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

    @InjectRepository(ClassSectionEntity)
    private readonly ClassSectionRepo: Repository<ClassSectionEntity>,

    private readonly httpService: HttpService,

    private readonly courseFilterQueryService: CourseFilteringQueryService,
  ) {}

  // 모든 학년-학기를 조회하는 함수
  async getSemesters() {
    const semesters = await this.semesterRepo.find();

    semesters.sort((a, b) => b.year - a.year || b.term - a.term);
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
      search,
      grade,
      day_or_night,
      no_class_days,
      personal_schedules,
      selected_courses,
      has_lunch_break,
    } = filters;

    /*
      SQL문으로 필터링 할 것들
      학기, 전공, 주야, 공강 요일, 미리 선택된 강의와 같은 과목코드의 강의,

      JS로 필터링 할 것들
      학년, 선택된 강의와 같은 시간의 강의,
      스케줄 시간대,
      점심 true라면 점심 시간에 포함된 강의들
    */
    const classSectionRepoAlias = 'cs';
    const courseRepoAlias = 'c';
    const offlineScheduleRepoAlias = 'os';
    const majorCourseRepoAlias = 'mc';

    const query = this.ClassSectionRepo.createQueryBuilder(
      classSectionRepoAlias,
    )
      .leftJoinAndSelect('cs.course', courseRepoAlias)
      .leftJoinAndSelect('cs.offline_schedules', offlineScheduleRepoAlias)
      .leftJoinAndSelect('c.major_courses', majorCourseRepoAlias);

    // 선택된 강의와 개인 스케줄을 요일 별로 묶을 Map
    const weeklyScheduleMap = new Map<WeekdayEnum, WeeklyScheduleType[]>();

    // 1. sql: 학기 필터링(필수)
    const semesterFilterQuery =
      this.courseFilterQueryService.getCoursesBySemester(
        classSectionRepoAlias,
        semester_id,
      );

    query.where(semesterFilterQuery.clause, semesterFilterQuery.params);

    // 2. sql: 전공 필터링(선택)
    if (major_code) {
      const majorFilterQuery = this.courseFilterQueryService.getCoursesByMajor(
        classSectionRepoAlias,
        major_code,
      );

      query.andWhere(majorFilterQuery.clause, majorFilterQuery.params);
    }

    // 3. 검색어 필터링(선택)
    if (search) {
      const searchFilterQuery =
        this.courseFilterQueryService.getCoursesBySearch(
          classSectionRepoAlias,
          courseRepoAlias,
          search,
        );

      query.andWhere(searchFilterQuery.clause, searchFilterQuery.params);
    }

    // 4. sql: 주야 필터링(선택)
    if (day_or_night) {
      const dayOrNightFilterQuery =
        this.courseFilterQueryService.getCoursesByDayOrNight(
          classSectionRepoAlias,
          day_or_night,
        );

      query.andWhere(
        dayOrNightFilterQuery.clause,
        dayOrNightFilterQuery.params,
      );
    }

    // 5. sql: 공강 요일 필터링(선택)
    if (no_class_days.length > 0) {
      const noClassDaysFilterQuery =
        this.courseFilterQueryService.getCoursesByNoClassDays(
          offlineScheduleRepoAlias,
          no_class_days,
        );

      query.andWhere(
        noClassDaysFilterQuery.clause,
        noClassDaysFilterQuery.params,
      );
    }

    // 6. sql: 미리 선택된 강의 필터링(선택)
    if (selected_courses.length > 0) {
      const selectedCoursesFilterQuery =
        this.courseFilterQueryService.getCoursesByPreSelectedCourses(
          courseRepoAlias,
          selected_courses,
          weeklyScheduleMap,
        );

      query.andWhere(
        selectedCoursesFilterQuery.clause,
        selectedCoursesFilterQuery.params,
      );
    }

    // 7. js: 개인 스케줄(선택)
    if (personal_schedules.length > 0) {
      // 그냥 weeklyScheduleMap에 추가만 하는 것이므로 따로 추가적인 작업 없이 호출만
      this.courseFilterQueryService.getCoursesByPersonalSchedulesFilter(
        personal_schedules,
        no_class_days,
        weeklyScheduleMap,
      );
    }

    // 1차로 필터링된 데이터
    const filteredCourses = await query.getMany();

    let flattendedResults: CourseDto[] = filteredCourses.map((fc) => {
      const { course: courseField, ...rest } = fc;

      return {
        semester_id: courseField.semester_id,
        course_id: rest.class_section_id,
        course_code: courseField.course_code,
        course_name: courseField.course_name,
        professor_names: rest.professor_names.split(','),
        completion_types: courseField.completion_type.split('/'),
        delivery_method: rest.delivery_method,
        credit: courseField.credit,
        day_or_night: rest.day_or_night,
        class_section: rest.class_section,
        grades: courseField.grade.split('/').map(Number),
        grade_limit: courseField.grade_limit,
        online_hour: rest.online_hour,
        offline_schedules: rest.offline_schedules,
        plan_code: rest.plan_code,
      };
    });

    // 8. js: 학년 필터링(선택)
    if (grade) {
      flattendedResults = flattendedResults.filter((course) => {
        if (course.grade_limit && course.grade_limit !== grade) {
          return false;
        }

        return course.grades.some((gd) => {
          return gd === 0 || gd === grade;
        });
      });
    }

    // weeklyScheduleMap에 포함되어 있는 시간대를 바탕으로 courses를 필터링
    flattendedResults =
      this.courseFilterQueryService.getCoursesFilterByWeeklySchedule(
        flattendedResults,
        weeklyScheduleMap,
      );

    // 9. js: 점심 시간 보장 제약이 true일 경우 강의의 시간이 점심 시간과 겹치는지 확인하는 로직
    if (has_lunch_break) {
      flattendedResults =
        this.courseFilterQueryService.getCoursesByLunchTimeFilter(
          flattendedResults,
        );
    }

    const paginationStart = (currentPage - 1) * pagePerLimit;
    const paginationEnd = paginationStart + pagePerLimit;

    flattendedResults = flattendedResults.slice(paginationStart, paginationEnd);

    return {
      mssage: '성공',
      data: flattendedResults,
    };
  }

  async filterDataAndPostConstraints(getCPSATCondition: GetCPSATResultDto) {
    const { currentPage, pagePerLimit, semester_id, constraints } =
      getCPSATCondition;

    // 선택된 강의와 개인 스케줄을 요일 별로 묶을 Map
    const weeklyScheduleMap = new Map<WeekdayEnum, WeeklyScheduleType[]>();

    const classSectionRepoAlias = 'cs';
    const courseRepoAlias = 'c';
    const offlineScheduleRepoAlias = 'os';
    const majorCourseRepoAlias = 'mc';

    const query = this.ClassSectionRepo.createQueryBuilder(
      classSectionRepoAlias,
    )
      .leftJoinAndSelect('cs.course', courseRepoAlias)
      .leftJoinAndSelect('cs.offline_schedules', offlineScheduleRepoAlias)
      .leftJoinAndSelect('c.major_courses', majorCourseRepoAlias);

    // 1. sql: 학기 필터링(필수)
    const semesterFilterQuery =
      this.courseFilterQueryService.getCoursesBySemester(
        classSectionRepoAlias,
        semester_id,
      );
    query.andWhere(semesterFilterQuery.clause, semesterFilterQuery.params);

    // 2. 전공 필터링
    const majorFilterQuery = this.courseFilterQueryService.getCoursesByMajor(
      classSectionRepoAlias,
      constraints.major_code,
    );
    query.andWhere(majorFilterQuery.clause, majorFilterQuery.params);

    // 3. 주야 필터링
    const dayOrNightFilterQuery =
      this.courseFilterQueryService.getCoursesByDayOrNight(
        classSectionRepoAlias,
        constraints.day_or_night,
      );
    query.andWhere(dayOrNightFilterQuery.clause, dayOrNightFilterQuery.params);

    // 4. 공강 요일 필터링(선택된 공강 요일이 있을 시)
    if (constraints.no_class_days.length > 0) {
      const noClassDaysFilterQuery =
        this.courseFilterQueryService.getCoursesByNoClassDays(
          offlineScheduleRepoAlias,
          constraints.no_class_days,
        );

      query.andWhere(
        noClassDaysFilterQuery.clause,
        noClassDaysFilterQuery.params,
      );
    }

    // 5. 미리 선택된 강의들의 강의 코드로 필터링
    if (constraints.selected_courses.length > 0) {
      const selectedCoursesFilterQuery =
        this.courseFilterQueryService.getCoursesByPreSelectedCourses(
          courseRepoAlias,
          constraints.selected_courses,
          weeklyScheduleMap,
        );

      query.andWhere(
        selectedCoursesFilterQuery.clause,
        selectedCoursesFilterQuery.params,
      );
    }

    // 6. 개인 스케줄
    if (constraints.personal_schedules.length > 0) {
      // 그냥 weeklyScheduleMap에 추가만 하는 것이므로 따로 추가적인 작업 없이 호출만
      this.courseFilterQueryService.getCoursesByPersonalSchedulesFilter(
        constraints.personal_schedules,
        constraints.no_class_days,
        weeklyScheduleMap,
      );
    }

    // 1차로 필터링된 데이터
    const filteredCourses = await query.getMany();

    let flattendedResults: CourseDto[] = filteredCourses.map((fc) => {
      const { course: courseField, ...rest } = fc;

      return {
        semester_id: courseField.semester_id,
        course_id: rest.class_section_id,
        course_code: courseField.course_code,
        course_name: courseField.course_name,
        professor_names: rest.professor_names.split(','),
        completion_types: courseField.completion_type.split('/'),
        delivery_method: rest.delivery_method,
        credit: courseField.credit,
        day_or_night: rest.day_or_night,
        class_section: rest.class_section,
        grades: courseField.grade.split('/').map(Number),
        grade_limit: courseField.grade_limit,
        online_hour: rest.online_hour,
        offline_schedules: rest.offline_schedules,
        plan_code: rest.plan_code,
      };
    });

    // 7. 학년 필터링
    flattendedResults = flattendedResults.filter((course) => {
      if (course.grade_limit && course.grade_limit !== constraints.grade) {
        return false;
      }

      return course.grades.some((gd) => {
        return gd === 0 || gd === constraints.grade;
      });
    });

    // weeklyScheduleMap에 포함되어 있는 시간대를 바탕으로 courses를 필터링
    flattendedResults =
      this.courseFilterQueryService.getCoursesFilterByWeeklySchedule(
        flattendedResults,
        weeklyScheduleMap,
      );

    // 8. js: 점심 시간 보장 제약이 true일 경우 강의의 시간이 점심 시간과 겹치는지 확인하는 로직
    if (constraints.has_lunch_break) {
      flattendedResults =
        this.courseFilterQueryService.getCoursesByLunchTimeFilter(
          flattendedResults,
        );
    }

    const finalFilteredCourses: CourseDto[] = [
      ...constraints.selected_courses,
      ...flattendedResults,
    ];

    // console.log(JSON.stringify(finalFilteredCourses, null, 2));

    const response = await firstValueFrom(
      this.httpService.post(`${process.env.FAST_API_BASE_URL}/cp-sat`, {
        filtered_data: finalFilteredCourses,
        // 밑의 강의들은 무조건 포함되도록 하기 위해서 같이 보냄
        pre_selected_courses: constraints.selected_courses,
        constraints: constraints,
      }),
    );

    const { total_solution_count, solutions } = response.data;

    const paginationStart = (currentPage - 1) * pagePerLimit;
    const paginationEnd = paginationStart + pagePerLimit;

    const slicedSolutions = solutions.slice(paginationStart, paginationEnd);

    return {
      message: '필터링 및 제약 조건 추출 성공',
      data: {
        total_solution_count,
        solutions: slicedSolutions,
      },
    };
  }
}
