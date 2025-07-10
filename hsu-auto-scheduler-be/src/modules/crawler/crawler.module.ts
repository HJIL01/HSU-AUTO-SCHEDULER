import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { CrawlerController } from './crawler.controller';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SemesterEntity } from 'src/common/entities/01_semester.entity';
import { MajorEntity } from 'src/common/entities/02_major.entity';
import { CourseEntity } from 'src/common/entities/03_course.entity';
import { OfflineScheduleEntity } from 'src/common/entities/04_offlineSchedule.entity';
import { SemesterMajorEntity } from 'src/common/entities/05_semester_major.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([
      SemesterEntity,
      MajorEntity,
      CourseEntity,
      OfflineScheduleEntity,
      SemesterMajorEntity,
    ]),
  ],
  controllers: [CrawlerController],
  providers: [CrawlerService],
  exports: [TypeOrmModule],
})
export class CrawlerModule {}
