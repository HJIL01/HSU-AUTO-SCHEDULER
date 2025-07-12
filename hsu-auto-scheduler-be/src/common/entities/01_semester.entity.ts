import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { CourseEntity } from './03_course.entity';
import { SemesterMajorEntity } from './05_semester_major.entity';
import { OfflineScheduleEntity } from './04_offlineSchedule.entity';

enum SemesterTermEnum {
  First = 1,
  Second = 2,
}

@Entity('semester')
export class SemesterEntity {
  @PrimaryColumn()
  semester_id: string;

  @Column()
  year: number;

  @Column({ type: 'enum', enum: SemesterTermEnum })
  term: SemesterTermEnum;

  @OneToMany(() => CourseEntity, (course) => course.semester)
  courses: CourseEntity[];

  @OneToMany(
    () => SemesterMajorEntity,
    (semester_majors) => semester_majors.semester,
  )
  semester_majors: SemesterMajorEntity[];

  @OneToMany(
    () => OfflineScheduleEntity,
    (offline_schedules) => offline_schedules.course,
  )
  offline_schedules: OfflineScheduleEntity[];
}
