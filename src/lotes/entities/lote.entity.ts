import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LoteImage } from './lote-image.entity';

@Entity({ name: 'lotes' })
export class Lote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  name: string;

  @Column({ type: 'int' })
  totalTrees: number; //total de arboles

  @Column({
    type: 'date',
    array: true,
  })
  fertilizerDate: Date[]; // fecha abonada

  @Column('date', {
    array: true,
  })
  plantingDate: Date[]; //fecha de sembrado

  @Column('date', {
    array: true,
  })
  cleanedDate: Date[]; //fecha de deyerba

  @Column({ type: 'int', default: 0 })
  numberReseeding?: number; //cantidad resiembra

  @Column({
    type: 'date',
    array: true,
  })
  reseedingDate?: Date[]; //fecha de resiembra

  @Column({ type: 'date', array: true })
  fumigatedDate?: Date[];

  @OneToMany(() => LoteImage, (loteImage) => loteImage.lote, {
    cascade: true,
    eager: true,
  })
  images?: LoteImage[];
}
