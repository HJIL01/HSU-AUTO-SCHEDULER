import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { WeekdayEnum } from 'src/common/enums/weekday.enum';
import { PersonalScheduleDto } from './personalSchedule.dto';
import { CourseDto } from 'src/common/dto/03_course.dto';
import { DayOrNightEnum } from 'src/common/enums/dayOrNight.enum';

export class ConstraintsDto {
  @IsString()
  @IsNotEmpty()
  semester_id: string;

  @IsString()
  @IsNotEmpty()
  major_code: string;

  @Type(() => Number)
  @IsNumber({ allowNaN: false }, { message: '학년은 숫자여야 합니다.' })
  grade: number;

  @IsEnum(DayOrNightEnum, {
    message: '유효한 주야 구분이 필요합니다',
  })
  day_or_night: DayOrNightEnum;

  @IsArray()
  @IsEnum(WeekdayEnum, { each: true })
  no_class_days: WeekdayEnum[];

  @IsArray()
  @ValidateNested()
  @Type(() => PersonalScheduleDto)
  personal_schedules: PersonalScheduleDto[];

  @IsArray()
  @ValidateNested()
  @Type(() => CourseDto)
  selected_courses: CourseDto[];

  @Type(() => Number)
  @IsNumber({ allowNaN: false }, { message: '최대 학점은 숫자여야 합니다.' })
  max_credit: number;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false },
    { message: '전공 기초 학점은 숫자여야 합니다.' },
  )
  major_foundation: number;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false },
    { message: '전공 필수 학점은 숫자여야 합니다.' },
  )
  major_required: number;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false },
    { message: '전공 선택 학점은 숫자여야 합니다.' },
  )
  major_elective: number;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false },
    { message: '하루 최대 강의 개수는 숫자여야 합니다.' },
  )
  daily_lecture_limit: number;

  @IsBoolean()
  has_lunch_break: boolean;
}

/* 
    학기 아이디,
    전공 아이디,
    학년,
    주야,
    공강 요일,
    개인 스케줄,
    추가된 수업,
    최대 학점,
    전공 기초,
    전공 필수,
    전공 선택,
    점심시간 확보 여부
 */
