import { Injectable } from '@nestjs/common';
import { ConstraintsDto } from './dto/constraints.dto';
import { Repository } from 'typeorm';
import { SemesterEntity } from 'src/common/entities/01_semester.entity';
import { MajorEntity } from 'src/common/entities/02_major.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from 'src/common/entities/04_course.entity';
import { OfflineScheduleEntity } from 'src/common/entities/05_offlineSchedule.entity';
import { SemesterMajorEntity } from 'src/common/entities/03_semester_major.entity';
import { PersonalScheduleDto } from './dto/personalSchedule.dto';

@Injectable()
export class ScheduleService {
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
      SQL문으로 필터링 할 것들
      학기, 전공, 학년, 주야, 공강 요일, 미리 선택된 강의,

      JS로 필터링 할 것들
      스케줄 시간대, 점심 true라면 점심 시간에 포함된 강의들
    */

    // SQL문으로 필터링
    const SQLFilteredData = await this.courseRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('major_course', 'mc', 'mc.course_id = c.course_id')
      .leftJoinAndSelect('c.offline_schedules', 'os')
      // 1. 학기 필터링
      .where('c.semester_id = :semester_id', {
        semester_id: constaraints.semester_id,
      })
      // 2. 전공 코드 필터링
      .andWhere('mc.major_code = :major_code', {
        major_code: constaraints.major_code,
      })
      // 3. 학년 필터링
      .andWhere('c.grade In (:...grade)', { grade: [constaraints.grade, 0] })
      // 4. 주야 필터링
      .andWhere('c.day_or_night IN (:...day_or_night)', {
        day_or_night: [constaraints.day_or_night, 'both'],
      })
      // 5. 공강 요일 필터링
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from('offline_schedule', 'os')
          .where('os.course_id = c.course_id')
          .andWhere('os.day In (:...excludeDays)', {
            excludeDays: constaraints.no_class_days,
          })
          .getQuery();

        return `NOT EXISTS ${subQuery}`;
      })
      // 6. 미리 선택된 강의들 필터링
      .andWhere('c.course_id NOT IN (:...selected_course_ids)', {
        selected_course_ids: constaraints.selected_courses.map(
          (selected) => selected.course_id,
        ),
      })
      .getMany();

    // 개인 스케줄을 요일 별로 묶을 Map
    const personalScheduleMap = new Map();

    // 공강 요일들을 묶어놓은 Set
    const noClassDaysSet = new Set(constaraints.no_class_days);

    const personalSchedules = constaraints.personal_schedule;

    personalSchedules.map((schedule) => {
      const { day, ...rest } = schedule;
      // 해당 강의가 공강 요일에 포함되지 않는다면
      if (!noClassDaysSet.has(day)) {
        // 해당 요일에 추가된 강의가 이미 있다면 리스트에 추가, 아니면 리스트를 만들기
        personalScheduleMap.has(day)
          ? personalScheduleMap.get(day).push(rest)
          : personalScheduleMap.set(day, [rest]);
      }
    });

    const JSFilteredData = SQLFilteredData.filter((data) => {
      return data.offline_schedules.every((cur_course_schedule) => {
        if (!personalScheduleMap.has(cur_course_schedule.day)) {
          return true;
        }

        const cur_course_schedule_start_time = cur_course_schedule.start_time;
        const cur_course_schedule_end_time = cur_course_schedule.end_time;

        if (constaraints.has_lunch_break) {
          const lunchStart = 720; // 12:00
          const lunchEnd = 780; // 13:00

          /* 
            현재 강의의 시작 시간이 항상 점심시간의 끝나는 시간보다 작고
            현재 강의의 끝나는 시간이 항상 점심시간의 시작 시간보다 크다면 -> 겹침 
          */
          const overlapsLunch =
            cur_course_schedule_start_time < lunchEnd &&
            cur_course_schedule_end_time > lunchStart;

          if (overlapsLunch) return false;
        }

        return personalScheduleMap
          .get(cur_course_schedule.day)
          .every((personal_schedule: PersonalScheduleDto) => {
            /*  
              겹치지 않는 경우의 반대의 경우 -> 겹치는 경우 false 
              겹치지 않는 경우
              1. 현재 강의의 end_time이 개인 스케줄의 start_time보다 작거나 같은 경우
              2. 현재 강의의 start_time이 개인 스케줄의 end_time보다 크거나 같은 경우

              위 두 강의 중 하나(||)를 부정하면(!) false
            */

            const cur_personal_schedule_start_time =
              personal_schedule.start_time;
            const cur_personal_schedule_end_time = personal_schedule.end_time;

            if (
              !(
                cur_course_schedule_end_time <=
                  cur_personal_schedule_start_time ||
                cur_personal_schedule_end_time <= cur_course_schedule_start_time
              )
            ) {
              // console.log(
              //   `${data.course_name}-${data.course_id} 요일: ${cur_course_schedule.day} 시작시간: ${cur_course_schedule_start_time} 종료시간: ${cur_course_schedule_end_time} 걸러짐`,
              // );
              return false;
            }

            return true;
          });
      });
    });

    // 아니 짐깐만 미리 선택된 강의들에 포함된 시간의 강의들도 빼야하지 않나?
    // return {
    //   message: "필터링 및 제약 조건 추출 성공",
    //   data: {
    //     filtered_data: JSFilteredData,
    //     max_credit: constaraints.max_credit,

    //   }
    // };
  }
}
