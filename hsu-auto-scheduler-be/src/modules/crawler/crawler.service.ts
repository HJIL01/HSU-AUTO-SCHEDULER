import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { SemesterEntity } from 'src/common/entities/01_semester.entity';
import { DataSource, In, Repository } from 'typeorm';
import { MajorEntity } from 'src/common/entities/02_major.entity';
import { CourseEntity } from 'src/common/entities/04_course.entity';
import { OfflineScheduleEntity } from 'src/common/entities/05_offlineSchedule.entity';
import { SemesterDto } from 'src/common/dto/01_semester.dto';
import { MajorDataDto } from './dto/majorData.dto';
import { SemesterMajorEntity } from 'src/common/entities/03_semester_major.entity';
import { CourseDataDto } from './dto/courseData.dto';
import { MajorCourseEntity } from 'src/common/entities/06_major_course.entity';

@Injectable()
export class CrawlerService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,

    @InjectRepository(SemesterEntity)
    private readonly semesterRepo: Repository<SemesterEntity>,

    @InjectRepository(MajorEntity)
    private readonly majorRepo: Repository<MajorEntity>,

    // @InjectRepository(CourseEntity)
    // private readonly courseRepo: Repository<CourseEntity>,

    // @InjectRepository(OfflineScheduleEntity)
    // private readonly offlineScheduleRepo: Repository<OfflineScheduleEntity>,

    // @InjectRepository(SemesterMajorEntity)
    // private readonly semesterMajorRepo: Repository<SemesterMajorEntity>,
  ) {}

  // 학기 테이블 서비스 메서드
  async findOrCreateSemester(semesterData: SemesterDto) {
    let semester = await this.semesterRepo.findOne({
      where: { semester_id: semesterData.semester_id },
    });

    if (semester) {
      return {
        message: `${semester.year}-${semester.term}학기는 이미 존재함.`,
      };
    }

    semester = this.semesterRepo.create({
      semester_id: semesterData.semester_id,
      year: semesterData.year,
      term: semesterData.term,
    });

    await this.semesterRepo.save(semester);
    return { message: `${semester.year}-${semester.term}학기 저장 성공` };
  }

  // 전공, 학기-전공 테이블 트랜잭션 서비스 메서드
  async createMajorTransactional(majorData: MajorDataDto) {
    const { semester_id, majors } = majorData;

    const semester = await this.semesterRepo.findOne({
      where: { semester_id },
    });
    if (!semester)
      throw new NotFoundException(
        `create Major:Semester ${semester_id} Not Found`,
      );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const results: Record<string, string>[] = [];

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
        const messageParts: string[] = [];

        if (!existingMajor) {
          majorEntity = queryRunner.manager.create(MajorEntity, {
            major_code: major.major_code,
            major_name: major.major_name,
          });
          await queryRunner.manager.save(majorEntity);
          messageParts.push('전공 저장');
        } else {
          messageParts.push('전공 이미 존재');
        }

        if (!existingSemesterMajor) {
          const semesterMajorEntity = queryRunner.manager.create(
            SemesterMajorEntity,
            {
              semester,
              major: majorEntity!,
            },
          );
          await queryRunner.manager.save(semesterMajorEntity);
          messageParts.push('학기-전공 저장');
        } else {
          messageParts.push('학기-전공 이미 존재');
        }

        results.push({
          majorName: major.major_name,
          message: messageParts.join(', '),
        });
      }

      await queryRunner.commitTransaction();
      return {
        message: `${semester.year}-${semester.term}학기 전공 데이터 저장 완료`,
        data: results,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // 강의, 오프라인 스케줄, 전공-강의 테이블 서비스 메서드
  async createCourseTransactional(courseData: CourseDataDto) {
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

    const results: string[] = [];
    try {
      // 강의 테이블의 아이디를 먼저 Set의 집합으로 만든 후, course가 이미 있다면 저장 패스
      const courseIds = courses.map((course) => course.course_id);
      const existingCourses = await queryRunner.manager.find(CourseEntity, {
        where: { course_id: In(courseIds) },
      });

      const existingSet = new Set(
        existingCourses.map((course) => course.course_id),
      );

      for (const course of courses) {
        const { offline_schedules, ...rest } = course;

        // 현재 강의가 강의 테이블에 존재하지 않는다면 오프라인 테이블도 존재하지 않으므로, 둘 다 save
        if (!existingSet.has(rest.course_id)) {
          const createdCourseEntity = queryRunner.manager.create(CourseEntity, {
            semester_id: rest.semester_id,
            course_id: rest.course_id,
            course_code: rest.course_code,
            course_name: rest.course_name,
            professor_names: rest.professor_names,
            completion_type: rest.completion_type,
            delivery_method: rest.delivery_method,
            credit: rest.credit,
            day_or_night: rest.day_or_night,
            class_section: rest.class_section,
            grade: rest.grade,
            grade_limit: rest.grade_limit,
            online_hour: rest.online_hour,
            plan_code: rest.plan_code,
            semester: semesterEntity,
          });

          await queryRunner.manager.save(CourseEntity, createdCourseEntity);

          // 오프라인 스케줄이 있다면 오프라인 스케줄 테이블에 저장
          if (offline_schedules.length > 0) {
            const createdOfflineScheduleEntities = offline_schedules.map(
              (off_schedule) => {
                const entity = new OfflineScheduleEntity();

                entity['day'] = off_schedule.day;
                entity['start_time'] = off_schedule.start_time;
                entity['end_time'] = off_schedule.end_time;
                entity['place'] = off_schedule.place;
                entity['course_id'] = createdCourseEntity.course_id;
                entity['course'] = createdCourseEntity;
                return entity;
              },
            );

            await queryRunner.manager.insert(
              OfflineScheduleEntity,
              createdOfflineScheduleEntities,
            );
          }
        } else {
          results.push(
            `Save Course Table Error: ${semesterEntity.year}-${semesterEntity.term}학기의 ${course.course_name}은 이미 존재함.`,
          );
        }

        // 강의와 전공 테이블이 있는지 먼저 찾기
        const [courseEntity, majorCourseEntity] = await Promise.all([
          queryRunner.manager.findOne(CourseEntity, {
            where: { course_id: course.course_id },
          }),
          queryRunner.manager.findOne(MajorCourseEntity, {
            where: {
              major_code: major_code,
              course_id: course.course_id,
              semester_id: semester_id,
            },
          }),
        ]);

        // 강의가 존재하지 않는다면 에러
        if (!courseEntity) {
          throw new NotFoundException(
            `Create major_course Table Error: course${course.course_id} Not Found`,
          );
        }

        // 이미 동일한 전공-강의 데이터가 존재할 경우 continue
        if (majorCourseEntity) {
          results.push(
            `Create major_course Table Error: ${majorCourseEntity.major_code}-${majorCourseEntity.course_id}가 이미 존재함.`,
          );

          continue;
        }

        // 전공-강의 데이터가 존재하지 않는다면 엔티티 create 후 save
        const createdMajorCourseEntity = queryRunner.manager.create(
          MajorCourseEntity,
          {
            major_code: major_code,
            course_id: course.course_id,
            semester_id: semester_id,
            major: majorEntity,
            course: courseEntity,
            semester: semesterEntity,
          },
        );

        await queryRunner.manager.save(
          MajorCourseEntity,
          createdMajorCourseEntity,
        );
      }

      await queryRunner.commitTransaction();
      return {
        message: `${semesterEntity.year}년 ${semesterEntity.term}학기 ${majorEntity.major_name} 강의 목록 저장 성공`,
        data: results,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
