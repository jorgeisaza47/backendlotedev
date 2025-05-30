import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'aguacate' })
export class Aguacate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  totalTrees: number;

  @Column({
    type: 'date',
    array: true,
  })
  fertilizerDate: Date[];

  @Column('jsonb')
  fumigatedDate: {
    date: Date;
    veneno: string;
  }[];

  @Column({
    type: 'date',
    array: true,
  })
  plantingDate: Date[];

  @Column({ type: 'text' })
  venenoAplicado: string;
}
