import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { CourseEntity } from './03_course.entity';
import { SemesterMajorEntity } from './05_semester_major.entity';

@Entity('major')
export class MajorEntity {
  @PrimaryColumn()
  major_code: string;

  @Column()
  major_name: string;

  @OneToMany(() => CourseEntity, (course) => course.major)
  courses: CourseEntity[];

  @OneToMany(
    () => SemesterMajorEntity,
    (semester_majors) => semester_majors.major,
  )
  semester_majors: SemesterMajorEntity[];
}
