import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { MajorEntity } from './02_major.entity';
import { CourseEntity } from './04_course.entity';
import { SemesterEntity } from './01_semester.entity';

@Entity('major_course')
export class MajorCourseEntity {
  @PrimaryColumn()
  major_code: string;

  @PrimaryColumn()
  course_id: string;

  @PrimaryColumn()
  semester_id: string;

  @ManyToOne(() => MajorEntity, (major) => major.major_courses)
  @JoinColumn({ name: 'major_code' })
  major: MajorEntity;

  @ManyToOne(() => CourseEntity, (course) => course.major_courses)
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;

  @ManyToOne(() => SemesterEntity, (semester) => semester.major_courses)
  @JoinColumn({ name: 'semester_id' })
  semester: SemesterEntity;
}
