import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ConstraintsDto } from './constraints.dto';

export class GetCPSATResultDto {
  @Type(() => Number)
  @IsNumber({ allowNaN: false }, { message: 'Current Page는 숫자여야 합니다.' })
  currentPage: number;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false },
    { message: 'Page Per Limit은 숫자여야 합니다.' },
  )
  pagePerLimit: number;

  @IsString()
  @IsNotEmpty()
  semester_id: string;

  @ValidateNested()
  @Type(() => ConstraintsDto)
  constraints: ConstraintsDto;
}
