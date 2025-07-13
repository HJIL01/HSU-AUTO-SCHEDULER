import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SemesterEntity } from 'src/common/entities/01_semester.entity';
import { MajorEntity } from 'src/common/entities/02_major.entity';
import { CourseEntity } from 'src/common/entities/04_course.entity';
import { OfflineScheduleEntity } from 'src/common/entities/05_offlineSchedule.entity';
import { SemesterMajorEntity } from 'src/common/entities/03_semester_major.entity';
import { MajorCourseEntity } from 'src/common/entities/06_major_course.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('DB_HOST'),
          port: +configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [
            SemesterEntity,
            MajorEntity,
            SemesterMajorEntity,
            CourseEntity,
            OfflineScheduleEntity,
            MajorCourseEntity,
          ],
          synchronize: false,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      SemesterEntity,
      MajorEntity,
      SemesterMajorEntity,
      CourseEntity,
      OfflineScheduleEntity,
      MajorCourseEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
