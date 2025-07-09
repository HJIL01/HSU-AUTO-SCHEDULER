import { IsNotEmpty, IsString } from 'class-validator';

export class MajorDto {
  @IsString()
  @IsNotEmpty()
  majorCode: string;

  @IsString()
  @IsNotEmpty()
  majorName: string;
}
