import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from 'src/common/entities/04_course.entity';
import { WeekdayEnum } from 'src/common/enums/weekday.enum';
import { Repository, SelectQueryBuilder } from 'typeorm';

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
}
