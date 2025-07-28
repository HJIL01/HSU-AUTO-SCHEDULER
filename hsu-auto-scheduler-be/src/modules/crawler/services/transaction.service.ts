import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { SemesterEntity } from 'src/common/entities/01_semester.entity';
import { MajorEntity } from 'src/common/entities/02_major.entity';
import { SemesterMajorEntity } from 'src/common/entities/03_semester_major.entity';
import { DataSource, In, Repository } from 'typeorm';
import { MajorDataDto } from '../dto/majorData.dto';
import { PersistenceService } from './persistence.service';
import { CourseDataDto } from '../dto/courseData.dto';
import { CourseEntity } from 'src/common/entities/04_course.entity';
import { SemesterDto } from 'src/common/dto/01_semester.dto';
import { MajorCourseEntity } from 'src/common/entities/06_major_course.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,

    @InjectRepository(SemesterEntity)
    private readonly semesterRepo: Repository<SemesterEntity>,

    @InjectRepository(MajorEntity)
    private readonly majorRepo: Repository<MajorEntity>,

    private readonly persistenceService: PersistenceService,
  ) {}
  async findOrCreateSemester(semesterData: SemesterDto) {
    let semesterEntity = await this.semesterRepo.findOne({
      where: { semester_id: semesterData.semester_id },
    });

    if (semesterEntity) {
      return {
        message: `${semesterEntity.year}-${semesterEntity.term}학기는 이미 존재함.`,
      };
    }

    semesterEntity = this.semesterRepo.create({
      semester_id: semesterData.semester_id,
      year: semesterData.year,
      term: semesterData.term,
    });

    await this.semesterRepo.save(semesterEntity);
    return {
      message: `${semesterEntity.year}-${semesterEntity.term}학기 저장 성공`,
    };
  }

  // 전공 저장 트랜잭션(전공, 학기-전공)
  async createMajorTransaction(majorData: MajorDataDto) {
    const { semester_id, majors } = majorData;

    const semesterEntity = await this.semesterRepo.findOne({
      where: { semester_id },
    });
    if (!semesterEntity)
      throw new NotFoundException(
        `create Major:Semester ${semester_id} Not Found`,
      );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const major of majors) {
        const [existingMajor, existingSemesterMajor] = await Promise.all([
          queryRunner.manager.findOne(MajorEntity, {
            where: { major_code: major.major_code },
          }),
          queryRunner.manager.findOne(SemesterMajorEntity, {
            where: { semester_id, major_code: major.major_code },
          }),
        ]);

        let majorEntity = existingMajor;

        //   전공 저장
        if (!existingMajor) {
          majorEntity = await this.persistenceService.insertIntoMajorTable(
            queryRunner,
            major,
          );

          console.log(`${semester_id}학기 ${major.major_name} 저장 성공`);
        } else {
          console.error(`${semester_id}학기 ${major.major_name} 이미 존재`);
        }

        //   학기-전공 저장
        if (!existingSemesterMajor) {
          const semesterMajorEntity =
            await this.persistenceService.insertIntoSemesterMajorTable(
              queryRunner,
              semesterEntity,
              majorEntity!,
            );

          console.log(
            `${semester_id}학기-${major.major_name} 관계 테이블 데이터 저장 성공`,
          );
        } else {
          console.error(
            `${semester_id}학기-${major.major_name} 관계 테이블 이미 존재`,
          );
        }
      }

      await queryRunner.commitTransaction();
      return {
        message: `${semesterEntity.year}-${semesterEntity.term}학기 전공 데이터 저장 완료`,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // 강의 저장 트랜잭션(강의, 전공-강의, 오프라인 스케줄)
  async createCourseTransaction(courseData: CourseDataDto) {
    const { semester_id, major_code, courses } = courseData;

    // courses가 존재하지 않으면 그대로 종료
    if (!courses) {
      return {
        message: `${semester_id}-${major_code}의 강의는 없습니다`,
      };
    }

    const [semesterEntity, majorEntity] = await Promise.all([
      this.semesterRepo.findOne({
        where: { semester_id },
      }),
      this.majorRepo.findOne({
        where: { major_code },
      }),
    ]);

    // 학기 테이블이 존재하지 않을 시 오류
    if (!semesterEntity) {
      throw new NotFoundException(`Create Course: ${semester_id} Not Found`);
    }

    // 강의 테이블이 존재하지 않을 시 오류
    if (!majorEntity) {
      throw new NotFoundException(`Create Course: ${major_code} Not Found`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const courseIds = courses.map((course) => course.course_id);
      const existingCoursesInCourseTable = await queryRunner.manager.find(
        CourseEntity,
        {
          where: { course_id: In(courseIds) },
        },
      );
      const existingCoursesInMajorCourseTable = await queryRunner.manager.find(
        MajorCourseEntity,
        {
          where: courseIds.map((courseId) => ({
            course: { course_id: courseId },
            major: { major_code: majorEntity.major_code },
            semester: { semester_id: semesterEntity.semester_id },
          })),
          relations: ['course', 'major', 'semester'],
        },
      );

      const existingCourseMap = existingCoursesInCourseTable.reduce(
        (acc, cur) => {
          acc.set(cur.course_id, cur);
          return acc;
        },
        new Map<string, CourseEntity>(),
      );

      const existingMajorCourseMap = existingCoursesInMajorCourseTable.reduce(
        (acc, cur) => {
          acc.set(`${cur.course_id}-${cur.major_code}`, cur);
          return acc;
        },
        new Map<string, MajorCourseEntity>(),
      );

      for (const course of courses) {
        let courseEntity = existingCourseMap.get(course.course_id);
        let majorCourseEntity = existingMajorCourseMap.get(
          `${course.course_id}-${major_code}`,
        );

        // course가 존재하지 않는다면 insert
        if (!courseEntity) {
          courseEntity = await this.persistenceService.insertIntoCourseTable(
            queryRunner,
            course,
            semesterEntity,
          );

          if (course.offline_schedules.length > 0) {
            const offlineScheduleEntites =
              await this.persistenceService.insertIntoOfflineScheduleTable(
                queryRunner,
                course.offline_schedules,
                courseEntity!,
              );
            console.log(`${course.course_id}의 오프라인 스케줄 저장 성공`);
          } else {
            console.error(
              `${course.course_id}의 오프라인 스케줄은 존재하지 않음`,
            );
          }

          console.log(
            `${course.course_id} 및 해당 course의 offline schedule 데이터 저장 성공`,
          );
        } else {
          console.error(
            `${course.course_id}이미 존재, 해당 course의 offline schedule 테이블 스킵`,
          );
        }

        if (!majorCourseEntity) {
          majorCourseEntity =
            await this.persistenceService.insertIntoMajorCourseTable(
              queryRunner,
              majorEntity,
              courseEntity!,
              semesterEntity,
              course.completion_type,
              course.grade,
            );

          console.log(
            `${major_code}-${course.course_id} 전공-강의 데이터 저장 성공`,
          );
        } else {
          console.error(`${major_code}-${course.course_id} 데이터 이미 존재`);
        }
      }

      await queryRunner.commitTransaction();
      return {
        message: `${semesterEntity.year}년 ${semesterEntity.term}학기 ${majorEntity.major_name} 강의 목록 저장 성공`,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
