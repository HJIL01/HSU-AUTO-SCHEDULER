import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { CourseEntity } from './04_course.entity';
import { SemesterMajorEntity } from './03_semester_major.entity';
import { MajorCourseEntity } from './07_major_course.entity';

@Entity('semester')
export class SemesterEntity {
  @PrimaryColumn()
  semester_id: string;

  @Column()
  year: number;

  @Column()
  term: number;

  @OneToMany(() => CourseEntity, (course) => course.semester)
  courses: CourseEntity[];

  @OneToMany(
    () => SemesterMajorEntity,
    (semester_majors) => semester_majors.semester,
  )
  semester_majors: SemesterMajorEntity[];

  @OneToMany(() => MajorCourseEntity, (major_course) => major_course.semester)
  major_courses: MajorCourseEntity[];
}
