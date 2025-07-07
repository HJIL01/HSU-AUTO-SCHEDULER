import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SessionBlockDto {
  @IsNotEmpty()
  @IsString()
  place: string;

  @IsNotEmpty()
  @IsString()
  day: string;

  @Type(() => Number)
  @IsNumber({ allowNaN: false }, { message: 'startTime은 숫자여야 합니다.' })
  startTime: number;

  @Type(() => Number)
  @IsNumber({ allowNaN: false }, { message: 'endTime은 숫자여야 합니다.' })
  endTime: number;
}
