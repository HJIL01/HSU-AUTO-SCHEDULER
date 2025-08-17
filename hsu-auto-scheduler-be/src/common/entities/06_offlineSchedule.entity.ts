import { Entity, Column, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CourseEntity } from './04_course.entity';
import { WeekdayEnum } from '../enums/weekday.enum';
import { ClassSectionEntity } from './05_classSection.entity';

@Entity('offline_schedule')
export class OfflineScheduleEntity {
  @PrimaryColumn()
  offline_schedule_id: string;

  @Column({ type: 'enum', enum: WeekdayEnum })
  day: WeekdayEnum;

  @Column()
  start_time: number;

  @Column()
  end_time: number;

  @Column()
  place: string;

  // 외래키
  @Column()
  semester_id: string;

  // 외래키
  @Column()
  course_code: string;

  // 외래키
  @Column()
  class_section_id: string;

  @ManyToOne(() => CourseEntity, (course) => course.offline_schedules)
  @JoinColumn([
    { name: 'semester_id', referencedColumnName: 'semester_id' },
    { name: 'course_code', referencedColumnName: 'course_code' },
  ])
  course: CourseEntity;

  @ManyToOne(
    () => ClassSectionEntity,
    (classSection) => classSection.offline_schedules,
  )
  @JoinColumn({ name: 'class_section_id' })
  class_section: ClassSectionEntity;
}
