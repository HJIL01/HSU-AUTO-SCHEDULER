import { Injectable } from '@nestjs/common';
import { ConstraintsDto } from './dto/constraints.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from 'src/common/entities/04_course.entity';
import { WeekdayEnum } from 'src/common/enums/weekday.enum';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { CourseDto } from 'src/common/dto/03_course.dto';

type WeeklyScheduleType = {
  schedule_name: string;
  start_time: number;
  end_time: number;
};

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepo: Repository<CourseEntity>,
    private readonly httpService: HttpService,
  ) {}

  async filterDataAndPostConstraints(constaraints: ConstraintsDto) {
    /* 
      SQL문으로 필터링 할 것들
      학기, 전공, 학년, 주야, 공강 요일, 미리 선택된 강의,

      JS로 필터링 할 것들
      선택된 강의와 같은 시간의 강의,
      스케줄 시간대, 
      점심 true라면 점심 시간에 포함된 강의들
    */

    // 선택된 강의와 개인 스케줄을 요일 별로 묶을 Map
    const weeklyScheduleMap = new Map<WeekdayEnum, WeeklyScheduleType[]>();

    // SQL문으로 필터링
    let query = await this.courseRepo
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
      });

    // 5. 공강 요일 필터링(선택된 공강 요일이 있을 시)
    if (constaraints.no_class_days.length > 0) {
      query = query.andWhere((qb) => {
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
      });
    }

    // 6. 미리 선택된 강의들의 강의 코드로 필터링(선택된 강의가 있을 시), 해당 시간대의 다른 강의를 거르기 위해 선택된 강의의 시간대를 weeklyScheduleMap에 저장
    if (constaraints.selected_courses.length > 0) {
      query = query.andWhere(
        'c.course_code NOT IN (:...selected_course_codes)',
        {
          selected_course_codes: constaraints.selected_courses.map(
            (selected) => {
              const selected_course_schedule = selected.offline_schedules;

              // 미리 선택된 강의의 오프라인 세션들을 탐색하여 WeeklySchedule에 추가
              selected_course_schedule?.forEach((cur_schedule) => {
                const cur_course_day = cur_schedule.day;
                const cur_course_start_time = cur_schedule.start_time;
                const cur_course_end_time = cur_schedule.end_time;

                const newWeeklySchedule: WeeklyScheduleType = {
                  schedule_name: selected.course_name,
                  start_time: cur_course_start_time,
                  end_time: cur_course_end_time,
                };

                const currentSchedules =
                  weeklyScheduleMap.get(cur_course_day) ?? [];

                currentSchedules.push(newWeeklySchedule);

                weeklyScheduleMap.set(cur_course_day, currentSchedules);
              });

              return selected.course_code;
            },
          ),
        },
      );
    }

    // 공강 요일들을 묶어놓은 Set
    const noClassDaysSet = new Set(constaraints.no_class_days);

    const personalSchedules = constaraints.personal_schedule;

    personalSchedules.map((schedule) => {
      const { day, ...rest } = schedule;
      // 해당 강의가 공강 요일에 포함되지 않는다면
      if (!noClassDaysSet.has(day)) {
        // 해당 요일에 추가된 강의가 이미 있다면 리스트에 추가, 아니면 리스트를 만들기
        weeklyScheduleMap.has(day)
          ? weeklyScheduleMap.get(day)!.push(rest)
          : weeklyScheduleMap.set(day, [rest]);
      }
    });

    const SQLFilteredData = await query.getMany();

    // 개인 스케줄, 미리 선택된 강의의 시간과 후보 강의의 시간이 겹치는지 확인하는 로직
    let JSFilteredData = SQLFilteredData.filter((data) => {
      return data.offline_schedules.every((cur_course_schedule) => {
        // 해당 강의가 위클리 스케줄의 요일과 겹치지 않는다면 검사할 필요가 없으므로 pass
        if (!weeklyScheduleMap.has(cur_course_schedule.day)) {
          return true;
        }

        return weeklyScheduleMap
          .get(cur_course_schedule.day)!
          .every((weekly_schedule: WeeklyScheduleType) => {
            /*  
              겹치지 않는 경우의 반대의 경우 -> 겹치는 경우 false 
              겹치지 않는 경우
              1. 현재 강의의 end_time이 위클리 스케줄의 start_time보다 작거나 같은 경우
              2. 현재 강의의 start_time이 위클리 스케줄의 end_time보다 크거나 같은 경우

              조건1: 위 두 조건 중 하나(||)를 부정하면(!) false

              조건2: 위의 조건1의 완전 역이라면 false
            */

            const cur_course_schedule_start_time =
              cur_course_schedule.start_time;
            const cur_course_schedule_end_time = cur_course_schedule.end_time;

            const cur_weekly_schedule_start_time = weekly_schedule.start_time;
            const cur_weekly_schedule_end_time = weekly_schedule.end_time;

            if (
              !(
                cur_course_schedule_end_time <=
                  cur_weekly_schedule_start_time ||
                cur_weekly_schedule_end_time <= cur_course_schedule_start_time
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

    // 점심 시간 보장 제약이 true일 경우 강의의 시간이 점심 시간과 겹치는지 확인하는 로직
    if (constaraints.has_lunch_break) {
      JSFilteredData = JSFilteredData.filter((data) => {
        return data.offline_schedules.every((cur_course_schedule) => {
          const lunchStart = 720; // 12:00
          const lunchEnd = 780; // 13:00

          const cur_course_schedule_start_time = cur_course_schedule.start_time;
          const cur_course_schedule_end_time = cur_course_schedule.end_time;

          /*
            현재 강의의 시작 시간이 항상 점심 시간의 끝나는 시간보다 작고
            현재 강의의 끝나는 시간이 항상 점심 시간의 시작 시간보다 크다면 -> 겹침 
          */
          const overlapsLunch =
            cur_course_schedule_start_time < lunchEnd &&
            cur_course_schedule_end_time > lunchStart;

          if (overlapsLunch) {
            return false;
          }

          return true;
        });
      });
    }

    console.log(JSFilteredData.length);
    console.log(JSON.stringify(JSFilteredData, null, 2));

    // 미리 선택된 강의들도 포함시키는 이유는 반드시 포함시켜서 연산해야할 제약조건(하루 최대 강의 수, 최대 학점, 전기, 전필, 전선 등)이 있기 때문
    const finalFilteredData: CourseDto[] = JSFilteredData.reduce(
      (acc, cur) => {
        const courseDto: CourseDto = {
          semester_id: cur.semester_id,
          course_id: cur.course_id,
          course_code: cur.course_code,
          course_name: cur.course_name,
          professor_names: cur.professor_names,
          completion_type: cur.completion_type,
          delivery_method: cur.delivery_method,
          credit: cur.credit,
          day_or_night: cur.day_or_night,
          class_section: cur.class_section,
          grade: cur.grade,
          grade_limit: cur.grade_limit,
          online_min: cur.online_min,
          offline_schedules: cur.offline_schedules,
          plan_code: cur.plan_code,
        };

        acc.push(courseDto);
        return acc;
      },
      [...constaraints.selected_courses],
    );

    const response = await firstValueFrom(
      this.httpService.post(`${process.env.FAST_API_BASE_URL}/cp-sat`, {
        filtered_data: finalFilteredData,
        // 밑의 강의들은 무조건 포함되도록 하기 위해서 같이 보냄
        pre_selected_courses: constaraints.selected_courses,
        constraints: constaraints,
      }),
    );

    return {
      message: '필터링 및 제약 조건 추출 성공',
      data: `${response.data}개`,
    };
  }
}
