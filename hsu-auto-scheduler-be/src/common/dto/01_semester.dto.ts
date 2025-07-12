import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SemesterDto {
  @IsString()
  @IsNotEmpty()
  semester_id: string;

  @Type(() => Number)
  @IsNumber({ allowNaN: false }, { message: 'year는 숫자여야 합니다.' })
  year: number;

  @Type(() => Number)
  @IsNumber({ allowNaN: false }, { message: 'term은 숫자여야 합니다.' })
  term: number;
}
