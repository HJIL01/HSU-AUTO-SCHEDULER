import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { SemesterMajorEntity } from './03_semester_major.entity';
import { MajorCourseEntity } from './07_major_course.entity';

@Entity('major')
export class MajorEntity {
  @PrimaryColumn()
  major_code: string;

  @Column()
  major_name: string;

  @OneToMany(
    () => SemesterMajorEntity,
    (semester_major) => semester_major.major,
  )
  semester_majors: SemesterMajorEntity[];

  @OneToMany(() => MajorCourseEntity, (major_course) => major_course.major)
  major_courses: MajorCourseEntity[];
}
