import { Module } from '@nestjs/common';
import { ScheduleConstraintsService } from './schedule-constraints.service';
import { ScheduleConstraintsController } from './schedule-constraints.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ScheduleConstraintsController],
  providers: [ScheduleConstraintsService],
})
export class ScheduleConstraintsModule {}
