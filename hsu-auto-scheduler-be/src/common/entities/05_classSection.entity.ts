import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Unique,
  ValueTransformer,
} from 'typeorm';
import { DayOrNightEnum } from '../enums/dayOrNight.enum';
import { CourseEntity } from './04_course.entity';
import { OfflineScheduleEntity } from './06_offlineSchedule.entity';

const columnNumericTransformer: ValueTransformer = {
  to(value: number): number {
    return value;
  },
  from(value: string): number {
    return parseFloat(value);
  },
};

@Entity('class_section')
@Unique(['semester_id', 'course_code', 'class_section', 'professor_names'])
export class ClassSectionEntity {
  @PrimaryColumn()
  class_section_id: string;

  @Column({ length: 10 })
  class_section: string;

  @Column({ length: 160 })
  professor_names: string;

  @Column({
    type: 'enum',
    enum: DayOrNightEnum,
  })
  day_or_night: DayOrNightEnum;

  @Column()
  delivery_method: string;

  @Column('decimal', {
    precision: 2,
    scale: 1,
    default: 0.0,
    transformer: columnNumericTransformer,
  })
  online_hour: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  plan_code: string | null;

  // 외래키
  @Column()
  course_code: string;

  // 외래키
  @Column()
  semester_id: string;

  @ManyToOne(() => CourseEntity, (course) => course.class_sections)
  @JoinColumn([
    { name: 'semester_id', referencedColumnName: 'semester_id' },
    { name: 'course_code', referencedColumnName: 'course_code' },
  ])
  course: CourseEntity;

  @OneToMany(
    () => OfflineScheduleEntity,
    (offline_schedule) => offline_schedule.class_section,
  )
  offline_schedules: OfflineScheduleEntity[];
}
