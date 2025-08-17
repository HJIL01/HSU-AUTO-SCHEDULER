import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './services/schedule.service';
import { HttpModule } from '@nestjs/axios';
import { CourseFilteringQueryService } from './services/CourseFilteringQuery.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SemesterEntity } from 'src/common/entities/01_semester.entity';
import { MajorEntity } from 'src/common/entities/02_major.entity';
import { CourseEntity } from 'src/common/entities/04_course.entity';
import { SemesterMajorEntity } from 'src/common/entities/03_semester_major.entity';
import { ClassSectionEntity } from 'src/common/entities/05_classSection.entity';
import { OfflineScheduleEntity } from 'src/common/entities/06_offlineSchedule.entity';
import { MajorCourseEntity } from 'src/common/entities/07_major_course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SemesterEntity,
      MajorEntity,
      SemesterMajorEntity,
      CourseEntity,
      ClassSectionEntity,
      OfflineScheduleEntity,
      MajorCourseEntity,
    ]),

    HttpModule,
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService, CourseFilteringQueryService],
})
export class ScheduleModule {}
