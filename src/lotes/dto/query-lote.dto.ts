import { Transform } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsPositive,
  IsDate,
  IsArray,
  IsOptional,
  ArrayNotEmpty,
  ValidateNested,
  IsDateString,
} from 'class-validator';
export class QueryLoteDto {
  @IsString()
  name?: string;

  @IsNumber()
  @IsPositive()
  totalTrees?: number;

  @IsOptional()
  @IsArray()
  fertilizerDate: Date[];

  @IsDate()
  @IsArray()
  plantingDate?: string[];

  @IsDate()
  @IsArray()
  cleanedDate?: string[];

  @IsNumber()
  @IsOptional()
  @IsPositive()
  numberReseeding?: number;

  @IsDate({ each: true })
  @IsArray()
  @IsOptional()
  reseedingDate?: string[];

  @IsOptional()
  @IsArray()
  @IsDate({ each: true })
  fumigatedDate?: string[];
}
