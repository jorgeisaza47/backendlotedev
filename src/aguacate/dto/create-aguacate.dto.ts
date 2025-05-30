import {
  IsArray,
  IsDate,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FumigacionDto } from './fumigated-aguacateDto';

export class CreateAguacateDto {
  @IsNumber()
  totalTrees: number;

  @IsDate()
  @IsArray()
  fertilizerDate: Date[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FumigacionDto)
  fumigatedDate: FumigacionDto[];

  @IsDate()
  @IsArray()
  plantingDate: Date[];

  @IsString()
  venenoAplicado: string;
}
