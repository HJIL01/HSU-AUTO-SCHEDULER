import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { OfflineScheduleEntity } from './05_offlineSchedule.entity';

export enum DayOrNightEnum {
  Day = 'day',
  Night = 'night',
  Both = 'both',
}

@Entity('course')
export class CourseEntity {
  @PrimaryColumn()
  course_id: string;

  @Column()
  course_code: string;

  @Column()
  course_name: string;

  @Column()
  completion_type: string;

  @Column()
  delivery_method: string;

  @Column()
  credit: number;

  @Column({
    type: 'enum',
    enum: DayOrNightEnum,
  })
  day_or_night: DayOrNightEnum;

  @Column()
  class_section: string;

  @Column()
  grade: number;

  @Column({ nullable: true })
  grade_limit: string;

  @Column({ default: 0 })
  online_min: number;

  @Column({ nullable: true })
  plan_code: string;

  @OneToMany(() => OfflineScheduleEntity, (schedule) => schedule.course)
  offlineSchedules: OfflineScheduleEntity[];
}
