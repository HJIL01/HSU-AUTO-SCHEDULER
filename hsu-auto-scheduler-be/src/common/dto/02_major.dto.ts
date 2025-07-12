import { IsNotEmpty, IsString } from 'class-validator';

export class MajorDto {
  @IsString()
  @IsNotEmpty()
  major_code: string;

  @IsString()
  @IsNotEmpty()
  major_name: string;
}
