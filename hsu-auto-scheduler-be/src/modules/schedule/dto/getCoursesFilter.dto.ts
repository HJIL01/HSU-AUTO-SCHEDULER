import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DayOrNightEnum } from 'src/common/enums/dayOrNight.enum';
import { WeekdayEnum } from 'src/common/enums/weekday.enum';
import { PersonalScheduleDto } from './personalSchedule.dto';
import { CourseDto } from 'src/common/dto/03_course.dto';

export class GetCoursesFilterDto {
  @IsString()
  @IsNotEmpty()
  semester_id: string;

  @IsOptional()
  @IsString()
  major_code?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowNaN: false }, { message: 'grade는 숫자여야 합니다.' })
  grade?: number | null;

  @IsOptional()
  @IsEnum(DayOrNightEnum, {
    message: '유효한 주야 구분이 필요합니다',
  })
  day_or_night?: DayOrNightEnum | null;

  @IsArray()
  @IsEnum(WeekdayEnum, { each: true })
  no_class_days: WeekdayEnum[];

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

  @IsArray()
  @ValidateNested()
  @Type(() => PersonalScheduleDto)
  personal_schedule: PersonalScheduleDto[];

  @IsArray()
  @ValidateNested()
  @Type(() => CourseDto)
  selected_courses: CourseDto[];
}
