import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CrawledCourseDto } from './crawledCourse.dto';

export class CourseDataDto {
  @IsString()
  @IsNotEmpty()
  semester_id: string;

  @IsString()
  @IsNotEmpty()
  major_code: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CrawledCourseDto)
  courses: CrawledCourseDto[] | null;
}
