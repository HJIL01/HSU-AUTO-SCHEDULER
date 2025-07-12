import { Injectable } from '@nestjs/common';
import { ConstraintsDto } from './dto/constraints.dto';
import { In, Repository } from 'typeorm';
import { SemesterEntity } from 'src/common/entities/01_semester.entity';
import { MajorEntity } from 'src/common/entities/02_major.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from 'src/common/entities/03_course.entity';
import { OfflineScheduleEntity } from 'src/common/entities/04_offlineSchedule.entity';
import { SemesterMajorEntity } from 'src/common/entities/05_semester_major.entity';

@Injectable()
export class ScheduleConstraintsService {
  constructor(
    @InjectRepository(SemesterEntity)
    private readonly semesterRepo: Repository<SemesterEntity>,

    @InjectRepository(MajorEntity)
    private readonly majorRepo: Repository<MajorEntity>,

    @InjectRepository(CourseEntity)
    private readonly courseRepo: Repository<CourseEntity>,

    @InjectRepository(OfflineScheduleEntity)
    private readonly offlineScheduleRepo: Repository<OfflineScheduleEntity>,

    @InjectRepository(SemesterMajorEntity)
    private readonly semesterMajorRepo: Repository<SemesterMajorEntity>,
  ) {}

  async filterDataAndPostConstraints(constaraints: ConstraintsDto) {
    /* 
      필터링 할 것들
      학기, 전공, 학년, 주야, 공강 요일, 
      미리 선택된 강의,
      스케줄 시간대, 점심 true라면 점심 시간에 포함된 강의들
    */
    const filteredData = await this.courseRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.offline_schedules', 'os')
      .where('c.semester_id = :semester_id', {
        semester_id: constaraints.semester_id,
      })
      .andWhere('c.major_id = :major_id', {
        major_id: constaraints.major_id,
      })
      .andWhere('c.grade In (:...grade)', { grade: [constaraints.grade, 0] })
      .andWhere('c.day_or_night In (:...day_or_night)', {
        day_or_night: [constaraints.day_or_night, 'both'],
      })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from('offline_schedule', 'os')
          .where('os.course_id = c.course_id')
          .andWhere('os.day IN (:...excludeDays)', {
            excludeDays: constaraints.no_class_days,
          })
          .getQuery();
        console.log(subQuery);
        return `NOT EXISTS ${subQuery}`;
      })
      .getMany();

    // console.log(filteredData);
    console.log(JSON.stringify(filteredData, null, 2));
    return '성공';
  }
}
