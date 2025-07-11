import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CourseDto } from 'src/common/dto/03_course.dto';

export class CourseDataDto {
  @IsString()
  @IsNotEmpty()
  semester_id: string;

  @IsString()
  @IsNotEmpty()
  major_id: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CourseDto)
  courses: CourseDto[] | null;
}
