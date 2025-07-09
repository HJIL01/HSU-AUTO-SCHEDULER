import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('professor')
export class ProfessorEntity {
  @PrimaryGeneratedColumn()
  professor_id: number;

  @Column()
  professor_name: string;
}
