import { PartialType } from '@nestjs/mapped-types';
import { CreateAguacateDto } from './create-aguacate.dto';

export class UpdateAguacateDto extends PartialType(CreateAguacateDto) {}
