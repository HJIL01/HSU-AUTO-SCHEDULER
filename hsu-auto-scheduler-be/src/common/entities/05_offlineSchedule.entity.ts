import { Entity, Column, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CourseEntity } from './04_course.entity';
import { WeekdayEnum } from '../enums/weekday.enum';

@Entity('offline_schedule')
export class OfflineScheduleEntity {
  @PrimaryColumn()
  offline_schedule_id: string;

  @Column()
  day: WeekdayEnum;

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
