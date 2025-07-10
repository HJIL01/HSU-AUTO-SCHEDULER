import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { OfflineScheduleEntity } from './04_offlineSchedule.entity';
import { SemesterEntity } from './01_semester.entity';
import { MajorEntity } from './02_major.entity';

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

  @Column()
  semester_id: string;

  @Column()
  major_id: string;

  @ManyToOne(() => SemesterEntity, (semester) => semester.courses)
  @JoinColumn({ name: 'semester_id' })
  semester: SemesterEntity;

  @ManyToOne(() => MajorEntity, (major) => major.courses)
  @JoinColumn({ name: 'major_id' })
  major: MajorEntity;

  @OneToMany(
    () => OfflineScheduleEntity,
    (offlineSchedule) => offlineSchedule.course,
  )
  offlineSchedules: OfflineScheduleEntity[];
}
