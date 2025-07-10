import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { CourseEntity } from './03_course.entity';
import { SemesterMajorEntity } from './05_semester_major.entity';

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
    (semesterMajors) => semesterMajors.semester,
  )
  semesterMajors: SemesterMajorEntity[];
}
