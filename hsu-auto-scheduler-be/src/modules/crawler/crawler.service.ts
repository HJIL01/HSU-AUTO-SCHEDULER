import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { SemesterEntity } from 'src/common/entities/01_semester.entity';
import { DataSource, In, Repository } from 'typeorm';
import { MajorEntity } from 'src/common/entities/02_major.entity';
import { CourseEntity } from 'src/common/entities/03_course.entity';
import { OfflineScheduleEntity } from 'src/common/entities/04_offlineSchedule.entity';
import { SemesterDto } from 'src/common/dto/01_semester.dto';
import { MajorDataDto } from './dto/majorData.dto';
import { SemesterMajorEntity } from 'src/common/entities/05_semester_major.entity';
import { CourseDataDto } from './dto/courseData.dto';
import { DayOrNightEnum } from 'src/common/enums/dayOrNight.enum';

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

    @InjectRepository(SemesterMajorEntity)
    private readonly semesterMajorRepo: Repository<SemesterMajorEntity>,
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
  async createSemesterAndMajorTransactional(majorData: MajorDataDto) {
    const { semester_id, majors } = majorData;

    const semester = await this.semesterRepo.findOne({
      where: { semester_id },
    });
    if (!semester)
      throw new NotFoundException(`Semester ${semester_id} not found`);

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

  // 강의, 오프라인 스케줄 테이블 서비스 메서드
  async createCourseAndOfflineScheduleTransactional(courseData: CourseDataDto) {
    const { semester_id, major_code, courses } = courseData;

    if (!courses) {
      return {
        message: `${semester_id}-${major_code}의 강의는 없습니다`,
      };
    }

    const [semester, major, semesterMajor] = await Promise.all([
      this.semesterRepo.findOne({ where: { semester_id } }),
      this.majorRepo.findOne({ where: { major_code } }),
      this.semesterMajorRepo.findOne({ where: { semester_id, major_code } }),
    ]);

    if (!semester) {
      throw new NotFoundException(`Semester ${semester_id} not found`);
    }

    if (!major) {
      throw new NotFoundException(`Major ${major_code} not found`);
    }

    if (!semesterMajor) {
      throw new NotFoundException(
        `Semester-Major ${semester_id}-${major_code} not found`,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const results: {
        courseName: string;
        classSection: string;
        message: string;
      }[] = [];
      /* 
        오프라인 강의 테이블은 course_id를 외래 키로 가지고 있으며, 
        course가 delete 시 연쇄적으로 삭제되는 cascade 제약을 적용하였으므로, 
        course_id가 없다면 관련된 오프라인 정보도 없음
        따라서 course_id만 존재하는지 확인 후, 있다면 message를 남기고 넘기기
      */
      const courseIds = courses.map((course) => course.course_id);
      const existingCourses = await queryRunner.manager.find(CourseEntity, {
        where: { course_id: In(courseIds) },
      });

      const existingSet = new Set(
        existingCourses.map((existingCourse) => existingCourse.course_id),
      );
      for (const course of courses) {
        const { offline_schedules, ...rest } = course;

        // 강의가 테이블에 이미 존재한다면 넘김
        if (existingSet.has(rest.course_id)) {
          results.push({
            courseName: rest.course_name,
            classSection: rest.class_section,
            message: `${rest.course_name} ${rest.class_section}반은 이미 존재`,
          });

          continue;
        }

        const courseEntity = queryRunner.manager.create(CourseEntity, {
          ...rest,
          semester,
          major,
        });

        await queryRunner.manager.save(courseEntity);

        /*  
          강의 스케줄 정보가 있을 시
          오프라인 스케줄 테이블은 course 테이블의 course_id를 참조하여 외래 키로 두고 있기 때문에 반드시 course를 먼저 생성한 후 오프라인 테이블 생성하기
        */
        if (offline_schedules && Array.isArray(offline_schedules)) {
          const offlineScheduleEntities = offline_schedules.map((schedule) => {
            const entity = new OfflineScheduleEntity();

            entity.day = schedule.day;
            entity.start_time = schedule.start_time;
            entity.end_time = schedule.end_time;
            entity.place = schedule.place;
            entity.course_id = rest.course_id;
            entity.semester_id = semester_id;

            return entity;
          });

          await queryRunner.manager.save(
            OfflineScheduleEntity,
            offlineScheduleEntities,
          );
        }
      }

      await queryRunner.commitTransaction();
      return {
        message: `${semester.year}년도 ${semester.term}학기의 ${major.major_name} 강의 목록 저장 성공`,
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
