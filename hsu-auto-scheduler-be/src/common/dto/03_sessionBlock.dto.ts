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
  @IsNumber()
  startTime: number;

  @Type(() => Number)
  @IsNumber()
  endtTime: number;
}
