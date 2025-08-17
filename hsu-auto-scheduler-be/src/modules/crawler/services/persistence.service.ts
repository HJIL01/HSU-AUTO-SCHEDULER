import { Injectable } from '@nestjs/common';
import { MajorDto } from 'src/common/dto/02_major.dto';
import { SemesterEntity } from 'src/common/entities/01_semester.entity';
import { MajorEntity } from 'src/common/entities/02_major.entity';
import { SemesterMajorEntity } from 'src/common/entities/03_semester_major.entity';
import { CourseEntity } from 'src/common/entities/04_course.entity';
import { OfflineScheduleEntity } from 'src/common/entities/06_offlineSchedule.entity';
import { MajorCourseEntity } from 'src/common/entities/07_major_course.entity';
import { QueryRunner } from 'typeorm';
import { CrawledCourseDto } from '../dto/crawledCourse.dto';
import { ClassSectionEntity } from 'src/common/entities/05_classSection.entity';
import { OfflineScheduleDto } from 'src/common/dto/04_offline_schedule.dto';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class PersistenceService {
  // major table 저장 메서드
  async insertIntoMajorTable(
    queryRunner: QueryRunner,
    major: MajorDto,
  ): Promise<MajorEntity> {
    const majorEntity = queryRunner.manager.create(MajorEntity, {
      major_code: major.major_code,
      major_name: major.major_name,
    });

    await queryRunner.manager.save(majorEntity);

    return majorEntity;
  }

  // semester-major table 저장 메서드
  async insertIntoSemesterMajorTable(
    queryRunner: QueryRunner,
    semesterEntity: SemesterEntity,
    majorEntity: MajorEntity,
  ) {
    const semesterMajorEntity = queryRunner.manager.create(
      SemesterMajorEntity,
      {
        semester_id: semesterEntity.semester_id,
        major_code: majorEntity.major_code,
        semester: semesterEntity,
        major: majorEntity,
      },
    );

    await queryRunner.manager.save(semesterMajorEntity);

    return semesterMajorEntity;
  }

  // course table 저장 메서드
  async insertIntoCourseTable(
    queryRunner: QueryRunner,
    course: CrawledCourseDto,
    semesterEntity: SemesterEntity,
  ) {
    const createdCourseEntity = queryRunner.manager.create(CourseEntity, {
      course_code: course.course_code,
      semester_id: course.semester_id,
      course_name: course.course_name,
      completion_type: course.completion_type,
      credit: course.credit,
      grade: course.grade,
      grade_limit: course.grade_limit,
      semester: semesterEntity,
    });

    await queryRunner.manager.save(CourseEntity, createdCourseEntity);

    return createdCourseEntity;
  }

  // class section table 저장 메서드
  async insertIntoClassSection(
    queryRunner: QueryRunner,
    course: CrawledCourseDto,
    courseEntity: CourseEntity,
  ) {
    const createdClassSectionEntity = queryRunner.manager.create(
      ClassSectionEntity,
      {
        class_section_id: uuidv7(),
        class_section: course.class_section,
        professor_names: course.professor_names,
        day_or_night: course.day_or_night,
        delivery_method: course.delivery_method,
        online_hour: course.online_hour,
        plan_code: course.plan_code,
        semester_id: course.semester_id,
        course: courseEntity,
      },
    );

    await queryRunner.manager.save(
      ClassSectionEntity,
      createdClassSectionEntity,
    );

    return createdClassSectionEntity;
  }

  // offline schedule table 저장 메서드
  async insertIntoOfflineScheduleTable(
    queryRunner: QueryRunner,
    offline_schedules: OfflineScheduleDto[],
    courseEntity: CourseEntity,
    classSectionEntity: ClassSectionEntity,
  ) {
    if (offline_schedules.length === 0) return;

    const offlineScheduleEntites = offline_schedules.map((off_schedule) => {
      const entity = new OfflineScheduleEntity();
      entity.semester_id = courseEntity.semester_id;
      entity.offline_schedule_id = off_schedule.offline_schedule_id;
      entity.day = off_schedule.day;
      entity.start_time = off_schedule.start_time;
      entity.end_time = off_schedule.end_time;
      entity.place = off_schedule.place!;
      entity.course = courseEntity;
      entity.class_section = classSectionEntity;

      return entity;
    });

    await queryRunner.manager.insert(
      OfflineScheduleEntity,
      offlineScheduleEntites,
    );

    return offlineScheduleEntites;
  }

  // major-course table 저장 메서드
  async insertIntoMajorCourseTable(
    queryRunner: QueryRunner,
    semesterEntity: SemesterEntity,
    majorEntity: MajorEntity,
    courseEntity: CourseEntity,
  ): Promise<MajorCourseEntity> {
    const majorCourseEntity = queryRunner.manager.create(MajorCourseEntity, {
      semester_id: semesterEntity.semester_id,
      major_code: majorEntity.major_code,
      course_code: courseEntity.course_code,
      semester: semesterEntity,
      major: majorEntity,
      course: courseEntity,
    });

    await queryRunner.manager.save(MajorCourseEntity, majorCourseEntity);

    return majorCourseEntity;
  }
}
