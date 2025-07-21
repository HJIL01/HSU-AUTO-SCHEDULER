import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from 'src/common/entities/04_course.entity';
import { WeekdayEnum } from 'src/common/enums/weekday.enum';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { WeeklyScheduleType } from './schedule.service';
import { PersonalScheduleDto } from '../dto/personalSchedule.dto';

type QueryFilterType = {
  clause: any;
  params: any;
};

@Injectable()
export class CourseFilteringQueryService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepo: Repository<CourseEntity>,
  ) {}

  getCoursesBySemester(alias: string, semester_id: string): QueryFilterType {
    return {
      clause: `${alias}.semester_id = :semester_id`,
      params: { semester_id },
    };
  }

  getCoursesByMajor(alias: string, major_code: string): QueryFilterType {
    return {
      clause: `${alias}.major_code = :major_code`,
      params: { major_code },
    };
  }

  getCoursesByGrade(alias: string, grade: number): QueryFilterType {
    return {
      clause: `${alias}.grade = :grade`,
      params: { grade },
    };
  }

  getCoursesByDayOrNight(alias: string, day_or_night: string): QueryFilterType {
    return {
      clause: `${alias}.day_or_night IN (:...day_or_night)`,
      params: { day_or_night: [day_or_night, 'both'] },
    };
  }

  getCoursesByNoClassDays(
    alias: string,
    no_class_days: WeekdayEnum[],
  ): QueryFilterType {
    return {
      clause: (qb: SelectQueryBuilder<CourseEntity>) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from('offline_schedule', 'os')
          .where(`os.course_id = ${alias}.course_id`)
          .andWhere('os.day IN (:...excludeDays)')
          .getQuery();

        return `NOT EXISTS ${subQuery}`;
      },
      params: {
        excludeDays: no_class_days,
      },
    };
  }

  getCoursesByPersonalSchedulesFilter(
    personal_schedules: PersonalScheduleDto[],
    no_class_days: WeekdayEnum[],
    weeklyScheduleMap: Map<WeekdayEnum, WeeklyScheduleType[]>,
  ): Map<WeekdayEnum, WeeklyScheduleType[]> {
    const noClassDaysSet = new Set(no_class_days);

    personal_schedules.forEach((personal_schedule) => {
      const { day, ...rest } = personal_schedule;

      // 해당 스케줄이 공강 요일에 포함되지 않는다면 weeklyScheduleMap에 추가
      if (!noClassDaysSet.has(day)) {
        weeklyScheduleMap.has(day)
          ? weeklyScheduleMap.get(day)!.push(rest)
          : weeklyScheduleMap.set(day, [rest]);
      }
    });

    return weeklyScheduleMap;
  }

  getCoursesByPreSelectedCourses(
    alias: string,
    selected_courses: CourseEntity[],
    weeklyScheduleMap: Map<WeekdayEnum, WeeklyScheduleType[]>,
  ): {
    query: QueryFilterType;
    weeklyScheduleMap: Map<WeekdayEnum, WeeklyScheduleType[]>;
  } {
    const query: QueryFilterType = {
      clause: `${alias}.course_code NOT IN (:...selected_course_codes)`,
      params: {
        selected_course_codes: selected_courses.map((selected) => {
          const selected_course_schedule = selected.offline_schedules;

          selected_course_schedule.forEach((cur_schedule) => {});

          return selected.course_code;
        }),
      },
    };

    return { query, weeklyScheduleMap };
  }

  getCoursesByLunchTimeFilter(courses: CourseEntity[]): CourseEntity[] {
    const lunchStart = 720; // 12:00
    const lunchEnd = 780; // 13:00

    courses = courses.filter((course) => {
      return course.offline_schedules.every((cur_course_offline_schedule) => {
        const cur_course_offline_schedule_start_time =
          cur_course_offline_schedule.start_time;
        const cur_course_offline_schedule_end_time =
          cur_course_offline_schedule.end_time;

        if (
          cur_course_offline_schedule_start_time < lunchEnd &&
          cur_course_offline_schedule_end_time > lunchStart
        ) {
          return false;
        }

        return true;
      });
    });

    return courses;
  }
}
