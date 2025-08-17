import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { OfflineScheduleEntity } from './06_offlineSchedule.entity';
import { SemesterEntity } from './01_semester.entity';
import { MajorCourseEntity } from './07_major_course.entity';
import { ClassSectionEntity } from './05_classSection.entity';

@Entity('course')
export class CourseEntity {
  @PrimaryColumn()
  course_code: string;

  @PrimaryColumn()
  semester_id: string;

  @Column()
  course_name: string;

  @Column()
  completion_type: string;

  @Column()
  credit: number;

  @Column({ length: 30 })
  grade: string;

  @Column({ type: 'int', nullable: true })
  grade_limit: number | null;

  @ManyToOne(() => SemesterEntity, (semester) => semester.courses)
  @JoinColumn({ name: 'semester_id' })
  semester: SemesterEntity;

  @OneToMany(() => ClassSectionEntity, (class_section) => class_section.course)
  class_sections: ClassSectionEntity[];

  @OneToMany(
    () => OfflineScheduleEntity,
    (offline_schedule) => offline_schedule.course,
  )
  offline_schedules: OfflineScheduleEntity[];

  @OneToMany(() => MajorCourseEntity, (major_course) => major_course.course)
  major_courses: MajorCourseEntity[];
}
