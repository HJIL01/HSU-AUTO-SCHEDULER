import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { OfflineScheduleEntity } from './05_offlineSchedule.entity';
import { SemesterEntity } from './01_semester.entity';
import { DayOrNightEnum } from '../enums/dayOrNight.enum';
import { MajorCourseEntity } from './06_major_course.entity';

@Entity('course')
export class CourseEntity {
  @Column()
  semester_id: string;

  @PrimaryColumn()
  course_id: string;

  @Column()
  course_code: string;

  @Column()
  course_name: string;

  @Column('json')
  professor_names: string[];

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

  grade_limit: number | null;

  @Column({ default: 0 })
  online_hour: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  plan_code: string | null;

  @ManyToOne(() => SemesterEntity, (semester) => semester.courses)
  @JoinColumn({ name: 'semester_id' })
  semester: SemesterEntity;

  @OneToMany(
    () => OfflineScheduleEntity,
    (offline_schedule) => offline_schedule.course,
  )
  offline_schedules: OfflineScheduleEntity[];

  @OneToMany(() => MajorCourseEntity, (major_course) => major_course.course)
  major_courses: MajorCourseEntity[];
}
