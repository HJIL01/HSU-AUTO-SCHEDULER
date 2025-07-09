import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { SessionBlockDto } from './05_sessionBlock.dto';
import { Type } from 'class-transformer';

export class SessionInfoDto {
  @Type(() => Number)
  @IsNumber({ allowNaN: false }, { message: '온라인 시간은 숫자여야 합니다.' })
  online: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SessionBlockDto)
  offline: SessionBlockDto[] | null;
}
