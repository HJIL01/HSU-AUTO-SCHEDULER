import { IsNumber } from 'class-validator';
import { SessionBlockDto } from './03_sessionBlock.dto';

export class SessionInfoDto {
  @IsNumber()
  online: number;

  offline: null | SessionBlockDto;
}
