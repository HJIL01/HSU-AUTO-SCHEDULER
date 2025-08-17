import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { MajorEntity } from './02_major.entity';
import { CourseEntity } from './04_course.entity';
import { SemesterEntity } from './01_semester.entity';

@Entity('major_course')
export class MajorCourseEntity {
  @PrimaryColumn()
  semester_id: string;

  @PrimaryColumn()
  major_code: string;

  @PrimaryColumn()
  course_code: string;

  @ManyToOne(() => SemesterEntity, (semester) => semester.major_courses)
  @JoinColumn({ name: 'semester_id' })
  semester: SemesterEntity;

  @ManyToOne(() => MajorEntity, (major) => major.major_courses)
  @JoinColumn({ name: 'major_code' })
  major: MajorEntity;

  @ManyToOne(() => CourseEntity, (course) => course.major_courses)
  @JoinColumn([
    { name: 'semester_id', referencedColumnName: 'semester_id' },
    { name: 'course_code', referencedColumnName: 'course_code' },
  ])
  course: CourseEntity;
}
