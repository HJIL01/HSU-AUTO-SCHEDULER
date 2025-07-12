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
import { DayOrNightEnum } from '../enums/dayOrNight.enum';

@Entity('course')
export class CourseEntity {
  @PrimaryColumn()
  course_id: string;

  @Column()
  course_code: string;

  @Column()
  course_name: string;

  @Column()
  professor_name: string;

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

  @Column({ type: 'varchar', length: 255, nullable: true })
  grade_limit: string | null;

  @Column({ default: 0 })
  online_min: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  plan_code: string | null;

  @Column()
  semester_id: string;

  @Column()
  major_code: string;

  @ManyToOne(() => SemesterEntity, (semester) => semester.courses)
  @JoinColumn({ name: 'semester_id' })
  semester: SemesterEntity;

  @ManyToOne(() => MajorEntity, (major) => major.courses)
  @JoinColumn({ name: 'major_code' })
  major: MajorEntity;

  @OneToMany(
    () => OfflineScheduleEntity,
    (offline_schedule) => offline_schedule.course,
  )
  offline_schedules: OfflineScheduleEntity[];
}
