import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DayOrNightEnum } from 'src/common/enums/dayOrNight.enum';
import { OfflineScheduleDto } from 'src/common/dto/04_offline_schedule.dto';

export class CrawledCourseDto {
  @IsString()
  @IsNotEmpty()
  semester_id: string;

  @IsString()
  @IsNotEmpty()
  course_code: string;

  @IsString()
  @IsNotEmpty()
  course_name: string;

  @IsString()
  @IsNotEmpty()
  professor_names: string;

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

  @IsString()
  @IsNotEmpty()
  grade: string;

  @IsOptional()
  @IsNumber({ allowNaN: false }, { message: '학년 제한은 숫자여야 합니다.' })
  grade_limit: number | null;

  @Type(() => Number)
  @IsNumber({ allowNaN: false }, { message: '온라인 시간은 숫자여야 합니다.' })
  online_hour: number;

  @ValidateNested({ each: true })
  @Type(() => OfflineScheduleDto)
  offline_schedules: OfflineScheduleDto[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  plan_code: string | null;
}
