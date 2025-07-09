import { Column, Entity, PrimaryColumn } from 'typeorm';

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
}
