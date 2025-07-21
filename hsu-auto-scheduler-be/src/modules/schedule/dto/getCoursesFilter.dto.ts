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

  @IsBoolean()
  has_lunch_break: boolean;

  @IsArray()
  @ValidateNested()
  @Type(() => PersonalScheduleDto)
  personal_schedules: PersonalScheduleDto[];

  @IsArray()
  @ValidateNested()
  @Type(() => CourseDto)
  selected_courses: CourseDto[];
}
