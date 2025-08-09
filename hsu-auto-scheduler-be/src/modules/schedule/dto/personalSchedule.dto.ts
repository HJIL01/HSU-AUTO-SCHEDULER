import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { OfflineScheduleDto } from 'src/common/dto/04_offline_schedule.dto';

export class PersonalScheduleDto {
  @IsString()
  @IsNotEmpty()
  personal_schedule_id: string;

  @IsString()
  @IsNotEmpty()
  personal_schedule_name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OfflineScheduleDto)
  offline_schedules: OfflineScheduleDto[];
}
