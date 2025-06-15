import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsPositive,
  IsDate,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { FumigacionDto } from './fumigacion-lote.dto';
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FumigacionDto)
  fumigatedDate: FumigacionDto[];

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
