import { Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';
import { GetCoursesFilterDto } from './getCoursesFilter.dto';

export class GetCoursesDto {
  @Type(() => Number)
  @IsNumber({ allowNaN: false }, { message: 'Current Page는 숫자여야 합니다.' })
  currentPage: number;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false },
    { message: 'Page Per Limit은 숫자여야 합니다.' },
  )
  pagePerLimit: number;

  @ValidateNested()
  @Type(() => GetCoursesFilterDto)
  filters: GetCoursesFilterDto;
}
