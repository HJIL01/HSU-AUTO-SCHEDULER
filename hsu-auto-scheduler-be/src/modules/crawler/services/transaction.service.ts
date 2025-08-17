import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { SemesterEntity } from 'src/common/entities/01_semester.entity';
import { MajorEntity } from 'src/common/entities/02_major.entity';
import { SemesterMajorEntity } from 'src/common/entities/03_semester_major.entity';
import { DataSource, Repository } from 'typeorm';
import { MajorDataDto } from '../dto/majorData.dto';
import { PersistenceService } from './persistence.service';
import { CourseDataDto } from '../dto/courseData.dto';
import { CourseEntity } from 'src/common/entities/04_course.entity';
import { SemesterDto } from 'src/common/dto/01_semester.dto';
import { MajorCourseEntity } from 'src/common/entities/07_major_course.entity';
import { ClassSectionEntity } from 'src/common/entities/05_classSection.entity';

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

  // 강의 저장 트랜잭션(강의, 분반, 오프라인 스케줄, 전공-강의)
  async createCourseTransaction(courseData: CourseDataDto) {
    const { semester_id, major_code, courses } = courseData;

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
      for (const course of courses) {
        let [
          existingCourseEntity,
          existingClassSectionEntity,
          existingMajorCourseEntity,
        ] = await Promise.all([
          queryRunner.manager.findOne(CourseEntity, {
            where: {
              course_code: course.course_code,
            },
          }),
          queryRunner.manager.findOne(ClassSectionEntity, {
            where: {
              semester_id: course.semester_id,
              course_code: course.course_code,
              class_section: course.class_section,
              professor_names: course.professor_names,
            },
          }),
          queryRunner.manager.findOne(MajorCourseEntity, {
            where: {
              semester_id: course.semester_id,
              major_code: major_code,
              course_code: course.course_code,
            },
          }),
        ]);

        // 강의가 존재하지 않는다면 저장
        if (!existingCourseEntity) {
          existingCourseEntity =
            await this.persistenceService.insertIntoCourseTable(
              queryRunner,
              course,
              semesterEntity,
            );
        }

        // 분반이 존재하지 않는다면 오프라인 스케줄도 존재하지 않음
        // 분반이 존재한다면 해당 오프라인 스케줄은 존재
        // 분반이 존재하면서 오프라인 스케줄이 존재하지 않을 가능성 없음
        if (!existingClassSectionEntity) {
          existingClassSectionEntity =
            await this.persistenceService.insertIntoClassSection(
              queryRunner,
              course,
              existingCourseEntity,
            );

          const offlineScheduleEntities =
            await this.persistenceService.insertIntoOfflineScheduleTable(
              queryRunner,
              course.offline_schedules,
              existingCourseEntity,
              existingClassSectionEntity,
            );
        }

        if (!existingMajorCourseEntity) {
          existingMajorCourseEntity =
            await this.persistenceService.insertIntoMajorCourseTable(
              queryRunner,
              semesterEntity,
              majorEntity,
              existingCourseEntity,
            );
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
