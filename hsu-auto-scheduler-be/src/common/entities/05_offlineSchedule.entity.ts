import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CourseEntity } from './03_course.entity';

@Entity('offline_schedule')
export class OfflineScheduleEntity {
  @PrimaryGeneratedColumn()
  offline_schedule_id: number;

  @ManyToOne(() => CourseEntity, (course) => course.offlineSchedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;

  @Column()
  day: string;

  @Column()
  start_time: number;

  @Column()
  end_time: number;

  @Column()
  location: string;
}
