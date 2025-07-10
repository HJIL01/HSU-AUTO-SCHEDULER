import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { MajorDto } from 'src/common/dto/02_major.dto';

export class MajorDataDto {
  @IsString()
  @IsNotEmpty()
  semester_id: string;

  @ValidateNested()
  @Type(() => MajorDto)
  major: MajorDto;
}
