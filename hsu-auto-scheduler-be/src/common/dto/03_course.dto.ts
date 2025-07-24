import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DayOrNightEnum } from '../enums/dayOrNight.enum';
import { OfflineScheduleDto } from './04_offline-schedule.dto';

export class CourseDto {
  @IsString()
  @IsNotEmpty()
  semester_id: string;

  @IsString()
  @IsNotEmpty()
  course_id: string;

  @IsString()
  @IsNotEmpty()
  course_code: string;

  @IsString()
  @IsNotEmpty()
  course_name: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  professor_names: string[];

  @IsString()
  @IsNotEmpty()
  completion_type: string;

  @IsString()
  @IsNotEmpty()
  delivery_method: string;

  @Type(() => Number)
  @IsNumber({ allowNaN: false }, { message: 'credit은 숫자여야 합니다' })
  credit: number;

  @IsEnum(DayOrNightEnum, {
    message: '유효한 주야 구분이 필요합니다',
  })
  day_or_night: DayOrNightEnum;

  @IsString()
  @IsNotEmpty()
  class_section: string;

  @Type(() => Number)
  @IsNumber({ allowNaN: false }, { message: 'grade는 숫자여야 합니다.' })
  grade: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  grade_limit: string | null;

  @Type(() => Number)
  @IsNumber({ allowNaN: false }, { message: '온라인 시간은 숫자여야 합니다.' })
  online_min: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OfflineScheduleDto)
  offline_schedules: OfflineScheduleDto[] | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  plan_code: string | null;
}
