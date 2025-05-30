import { Module } from '@nestjs/common';
import { LotesService } from './lotes.service';
import { LotesController } from './lotes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lote } from './entities/lote.entity';
import { LoteImage } from './entities/lote-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lote, LoteImage])],
  controllers: [LotesController],
  providers: [LotesService],
})
export class LotesModule {}
