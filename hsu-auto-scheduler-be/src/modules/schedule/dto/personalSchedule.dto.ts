import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { PersonalScheduleOfflineScheduleDto } from './personalScheduleOfflineSchedule.dto';

export class PersonalScheduleDto {
  @IsString()
  @IsNotEmpty()
  personal_schedule_id: string;

  @IsString()
  @IsNotEmpty()
  schedule_name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PersonalScheduleOfflineScheduleDto)
  offline_schedules: PersonalScheduleOfflineScheduleDto[];
}
