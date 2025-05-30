import { IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class FumigacionDto {
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsString()
  veneno: string;
}