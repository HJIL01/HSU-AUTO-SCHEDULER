import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { CourseEntity } from './04_course.entity';
import { SemesterEntity } from './01_semester.entity';

@Entity('offline_schedule')
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
  place: string;

  @Column()
  course_id: string;

  @ManyToOne(() => CourseEntity, (course) => course.offline_schedules)
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;
}
