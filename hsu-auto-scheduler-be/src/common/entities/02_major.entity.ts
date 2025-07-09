import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('major')
export class MajorEntity {
  @PrimaryColumn()
  major_id: string;

  @Column()
  major_name: string;
}
