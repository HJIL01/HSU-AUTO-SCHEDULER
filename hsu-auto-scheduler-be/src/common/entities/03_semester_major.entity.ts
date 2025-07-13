import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { SemesterEntity } from './01_semester.entity';
import { MajorEntity } from './02_major.entity';

@Entity('semester_major')
export class SemesterMajorEntity {
  @PrimaryColumn()
  semester_id: string;

  @PrimaryColumn()
  major_code: string;

  @ManyToOne(() => SemesterEntity, (semester) => semester.semester_majors)
  @JoinColumn({ name: 'semester_id' })
  semester: SemesterEntity;

  @ManyToOne(() => MajorEntity, (major) => major.semester_majors)
  @JoinColumn({ name: 'major_code' })
  major: MajorEntity;
}
