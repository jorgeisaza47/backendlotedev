import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('date')
  transactionDate: Date;

  @Column('int')
  amount: number;

  @Column('int')
  cost: number;

  @Column('text')
  type: string;

  @Column('text')
  concept: string;
}
