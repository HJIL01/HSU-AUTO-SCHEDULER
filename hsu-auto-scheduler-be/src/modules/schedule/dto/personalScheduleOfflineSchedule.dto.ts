import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { WeekdayEnum } from 'src/common/enums/weekday.enum';

export class PersonalScheduleOfflineScheduleDto {
  @IsString()
  @IsNotEmpty()
  offline_schedule_id: string;

  @IsEnum(WeekdayEnum)
  @IsNotEmpty()
  day: WeekdayEnum;

  @Type(() => Number)
  @IsNumber({ allowNaN: false }, { message: 'startTime은 숫자여야 합니다.' })
  start_time: number;

  @Type(() => Number)
  @IsNumber({ allowNaN: false }, { message: 'endTime은 숫자여야 합니다.' })
  end_time: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  place: string | null;
}
