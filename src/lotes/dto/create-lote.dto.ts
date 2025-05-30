import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsPositive,
  IsDate,
  IsArray,
  IsOptional,
} from 'class-validator';
export class CreateLoteDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  totalTrees: number;

  @IsDate()
  @IsArray()
  fertilizerDate: Date[];

  @IsDate()
  @IsArray()
  plantingDate: Date[];

  @IsDate()
  @IsArray()
  cleanedDate: Date[];

  @IsNumber()
  @IsOptional()
  @IsPositive()
  numberReseeding?: number;

  @IsDate({ each: true })
  @IsArray()
  @IsOptional()
  reseedingDate?: Date[];

  @IsOptional()
  @IsArray()
  @IsDate({ each: true })
  fumigatedDate?: Date[];

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
