import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { CourseEntity } from './03_course.entity';
import { SemesterEntity } from './01_semester.entity';

@Entity('offline_schedule')
@Unique(['course_id', 'day', 'start_time', 'end_time'])
export class OfflineScheduleEntity {
  @PrimaryGeneratedColumn()
  offline_schedule_id: number;

  @Column()
  day: string;

  @Column()
  start_time: number;

  @Column()
  end_time: number;

  @Column()
  location: string;

  @Column()
  course_id: string;

  @Column()
  semester_id: string;

  @ManyToOne(() => SemesterEntity, (semester) => semester.offlineSchedules)
  @JoinColumn({ name: 'semester_id' })
  semester: SemesterEntity;

  @ManyToOne(() => CourseEntity, (course) => course.offlineSchedules)
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;
}
