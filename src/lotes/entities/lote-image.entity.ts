import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Lote } from './lote.entity';

@Entity({ name: 'lote_images' })
export class LoteImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  @ManyToOne(() => Lote, (lote) => lote.images, {
    onDelete: 'CASCADE',
  })
  lote: Lote;
}
