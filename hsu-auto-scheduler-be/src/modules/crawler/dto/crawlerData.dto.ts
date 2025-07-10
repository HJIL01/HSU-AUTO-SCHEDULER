import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { SemesterDto } from 'src/common/dto/01_semester.dto';
import { MajorDto } from 'src/common/dto/02_major.dto';
import { CourseDto } from 'src/common/dto/03_course.dto';

export class CrawledDataDto {
  @ValidateNested()
  @Type(() => SemesterDto)
  semester: SemesterDto;

  @ValidateNested()
  @Type(() => MajorDto)
  major: MajorDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CourseDto)
  courses: CourseDto[] | null;
}
