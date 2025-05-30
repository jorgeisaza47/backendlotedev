import { Module } from '@nestjs/common';
import { AguacateService } from './aguacate.service';
import { AguacateController } from './aguacate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aguacate } from './entities/aguacate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Aguacate])],
  controllers: [AguacateController],
  providers: [AguacateService],
})
export class AguacateModule {}
