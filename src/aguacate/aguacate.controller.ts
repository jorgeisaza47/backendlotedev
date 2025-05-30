import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AguacateService } from './aguacate.service';
import { CreateAguacateDto } from './dto/create-aguacate.dto';
import { UpdateAguacateDto } from './dto/update-aguacate.dto';

@Controller('aguacate')
export class AguacateController {
  constructor(private readonly aguacateService: AguacateService) {}

  @Post()
  create(@Body() createAguacateDto: CreateAguacateDto) {
    return this.aguacateService.create(createAguacateDto);
  }

  @Get()
  findAll() {
    return this.aguacateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aguacateService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAguacateDto: UpdateAguacateDto,
  ) {
    return this.aguacateService.update(id, updateAguacateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aguacateService.remove(+id);
  }
}
