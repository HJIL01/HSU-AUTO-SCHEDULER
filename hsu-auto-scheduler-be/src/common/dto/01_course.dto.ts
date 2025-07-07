import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
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
  @IsNumber({ allowNaN: false }, { message: 'credit은 숫자여야 합니다' })
  credit: number;

  @IsEnum(['day', 'night', 'both'], {
    message: '유효한 주야 구분이 필요합니다',
  })
  dayOrNight: 'day' | 'night' | 'both';

  @IsString()
  @IsNotEmpty()
  classSection: string;

  @Type(() => Number)
  @IsNumber({ allowNaN: false }, { message: 'grade는 숫자여야 합니다.' })
  grade: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowNaN: false }, { message: 'gradeLimit은 숫자여야 합니다.' })
  gradeLimit: number | null;

  @IsString()
  @IsNotEmpty()
  professor: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  planCode: string | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => SessionInfoDto)
  sessionInfo: SessionInfoDto | null;
}
