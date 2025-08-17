import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CrawledCourseDto } from './crawledCourse.dto';

export class CourseDataDto {
  @IsString()
  @IsNotEmpty()
  semester_id: string;

  @IsString()
  @IsNotEmpty()
  major_code: string;

  @ValidateNested({ each: true })
  @Type(() => CrawledCourseDto)
  courses: CrawledCourseDto[];
}
