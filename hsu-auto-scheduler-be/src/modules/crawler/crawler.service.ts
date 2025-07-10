import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SemesterEntity } from 'src/common/entities/01_semester.entity';
import { Repository } from 'typeorm';
import { MajorEntity } from 'src/common/entities/02_major.entity';
import { CourseEntity } from 'src/common/entities/03_course.entity';
import { OfflineScheduleEntity } from 'src/common/entities/04_offlineSchedule.entity';
import { SemesterDto } from 'src/common/dto/01_semester.dto';
import { MajorDto } from 'src/common/dto/02_major.dto';
import { MajorDataDto } from './dto/majorData.dto';

@Injectable()
export class CrawlerService {
  constructor(
    @InjectRepository(SemesterEntity)
    private semesterRepo: Repository<SemesterEntity>,

    @InjectRepository(MajorEntity)
    private majorRepo: Repository<MajorEntity>,

    @InjectRepository(CourseEntity)
    private courseRepo: Repository<CourseEntity>,

    @InjectRepository(OfflineScheduleEntity)
    private offlineScheduleRepo: Repository<OfflineScheduleEntity>,
  ) {}

  async findOrCreateSemester(semesterData: SemesterDto) {
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

  async findOrCreateMajor(majorData: MajorDataDto) {
    let { semester_id, major } = majorData;
  }
}
