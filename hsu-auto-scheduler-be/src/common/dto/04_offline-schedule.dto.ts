import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OfflineScheduleDto {
  @IsNotEmpty()
  @IsString()
  day: string;

  @Type(() => Number)
  @IsNumber({ allowNaN: false }, { message: 'start_time은 숫자여야 합니다.' })
  start_time: number;

  @Type(() => Number)
  @IsNumber({ allowNaN: false }, { message: 'end_time은 숫자여야 합니다.' })
  end_time: number;

  @IsNotEmpty()
  @IsString()
  place: string;
}
