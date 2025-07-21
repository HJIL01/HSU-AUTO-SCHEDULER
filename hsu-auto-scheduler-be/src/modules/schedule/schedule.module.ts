import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './services/schedule.service';
import { HttpModule } from '@nestjs/axios';
import { CourseFilteringQueryService } from './services/CourseFilteringQuery.service';

@Module({
  imports: [
    DatabaseModule,
    HttpModule.register({
      timeout: 8000,
      maxRedirects: 3,
    }),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService, CourseFilteringQueryService],
})
export class ScheduleModule {}
