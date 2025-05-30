import {
  IsDate,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class QueryTransactionDto {
  @IsDate()
  @IsOptional()
  transactionDate: Date;

  @IsNumber()
  @IsOptional()
  transactionYear: number;

  @IsNumber()
  @IsOptional()
  transactionMonth: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  amount?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  cost?: number;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  concept?: string;
}
