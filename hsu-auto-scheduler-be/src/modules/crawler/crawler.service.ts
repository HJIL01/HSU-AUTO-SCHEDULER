import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { SemesterEntity } from 'src/common/entities/01_semester.entity';
import { DataSource, Repository } from 'typeorm';
import { MajorEntity } from 'src/common/entities/02_major.entity';
import { CourseEntity } from 'src/common/entities/03_course.entity';
import { OfflineScheduleEntity } from 'src/common/entities/04_offlineSchedule.entity';
import { SemesterDto } from 'src/common/dto/01_semester.dto';
import { MajorDataDto } from './dto/majorData.dto';
import { SemesterMajorEntity } from 'src/common/entities/05_semester_major.entity';

@Injectable()
export class CrawlerService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,

    @InjectRepository(SemesterEntity)
    private semesterRepo: Repository<SemesterEntity>,

    @InjectRepository(MajorEntity)
    private majorRepo: Repository<MajorEntity>,

    @InjectRepository(CourseEntity)
    private courseRepo: Repository<CourseEntity>,

    @InjectRepository(OfflineScheduleEntity)
    private offlineScheduleRepo: Repository<OfflineScheduleEntity>,

    @InjectRepository(SemesterMajorEntity)
    private semesterMajorRepo: Repository<SemesterMajorEntity>,
  ) {}

  async findOrCreateSemester(semesterData: SemesterDto) {
    console.log(semesterData);
    let semester = await this.semesterRepo.findOne({
      where: { semester_id: semesterData.semesterCode },
    });

    if (semester) {
      return {
        message: `${semester.year}-${semester.term}학기는 이미 존재함.`,
      };
    }

    semester = this.semesterRepo.create({
      semester_id: semesterData.semesterCode,
      year: semesterData.year,
      term: semesterData.term,
    });

    await this.semesterRepo.save(semester);
    return { message: `${semester.year}-${semester.term}학기 저장 성공` };
  }

  async createSemesterAndMajorTransactional(majorData: MajorDataDto) {
    let { semester_id, major } = majorData;

    const semester = await this.semesterRepo.findOne({
      where: { semester_id },
    });

    if (!semester) {
      throw new NotFoundException(`Semester ${semester_id} not found`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let majorEntity = await queryRunner.manager.findOne(MajorEntity, {
        where: { major_id: major.majorCode },
      });

      if (majorEntity) {
        return {
          message: `${semester.year}-${semester.term}학기의 ${major.majorName}이 이미 존재함`,
        };
      }

      majorEntity = queryRunner.manager.create(MajorEntity, {
        major_id: major.majorCode,
        major_name: major.majorName,
      });

      let semesterMajorEntity = await queryRunner.manager.findOne(
        SemesterMajorEntity,
        {
          where: { semester_id, major_id: major.majorCode },
        },
      );

      if (semesterMajorEntity) {
        return {
          message: `${semester_id}-${major.majorName} 관계 테이블에 데이터가 존재함`,
        };
      }

      semesterMajorEntity = queryRunner.manager.create(SemesterMajorEntity, {
        semester,
        major: majorEntity,
      });

      await queryRunner.manager.save(majorEntity);
      await queryRunner.manager.save(semesterMajorEntity);

      await queryRunner.commitTransaction();

      return {
        message: `${semester.year}-${semester.term}학기-${major.majorName} 테이블 저장 성공`,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
