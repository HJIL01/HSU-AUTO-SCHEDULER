import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { SessionInfoDto } from './02_sessionInfo.dto';

export class CourseDto {
  @IsString()
  @IsNotEmpty()
  courseCode: string;

  @IsString()
  @IsNotEmpty()
  courseName: string;

  @IsString()
  @IsNotEmpty()
  completionType: string;

  @IsString()
  @IsNotEmpty()
  deliveryMethod: string;

  @Type(() => Number)
  @IsNumber()
  credit: number;

  @IsEnum(['day', 'night', 'both'], {
    message: '유효한 주야 구분이 필요합니다',
  })
  dayOrNight: 'day' | 'night' | 'both';

  @IsString()
  @IsNotEmpty()
  classSection: string;

  @IsString()
  @IsNotEmpty()
  grade: string;

  gradeLimig: number | null;

  @IsString()
  @IsNotEmpty()
  professor: string;

  planCode: string | null;

  sessionInfo: null | SessionInfoDto;
}

export class WrapArrayCourseDto {
  @ValidateNested({ each: true })
  @Type(() => CourseDto)
  courses: CourseDto[];
}
