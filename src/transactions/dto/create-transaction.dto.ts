import { IsDate, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsDate()
  transactionDate: Date;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsNumber()
  @IsPositive()
  cost: number;

  @IsString()
  type: string;

  @IsString()
  concept: string;
}
