import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Lote } from './entities/lote.entity';
import { LoteImage } from './entities/lote-image.entity';
import { isUUID } from 'class-validator';
import { QueryLoteDto } from './dto/query-lote.dto';
import { format } from 'date-fns';

@Injectable()
export class LotesService {
  private readonly logger = new Logger('LotesService');
  constructor(
    @InjectRepository(Lote)
    private readonly loteRepository: Repository<Lote>,

    @InjectRepository(LoteImage)
    private readonly loteImageRepository: Repository<LoteImage>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createLoteDto: CreateLoteDto) {
    try {
      const { images = [], ...createBatch } = createLoteDto;
      const batch = this.loteRepository.create({
        ...createBatch,
        images: images.map((image) =>
          this.loteImageRepository.create({ url: image }),
        ),
      });
      await this.loteRepository.save(batch);
      return { ...batch, images };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          `Ya existe un lote con el nombre ${createLoteDto.name}`,
        );
      }
      this.handleExceptions(error);
    }
  }

  async findAll(queryLoteDto: QueryLoteDto): Promise<Lote[]> {
    const batchs = this.loteRepository.find({
      relations: {
        images: true,
      },
    });
    const query = this.loteRepository.createQueryBuilder('lote');

    if (queryLoteDto.name) {
      query.andWhere('lote.name =:name', {
        name: queryLoteDto.name,
      });
    }
    // query.select([
    //   "ARRAY_TO_STRING(ARRAY(SELECT TO_CHAR(unnest(lote.fertilizerDate), 'YYYY-MM-DD')), ',') AS fertilizerDate"
    // ]);
    // if (queryLoteDto.fertilizerDate) {
    //   try {
    //     let dateRange = queryLoteDto.fertilizerDate;
    //     if (typeof dateRange === 'string') {
    //       dateRange = dateRange.split(',');
    //     }

    //     const startDateStr = dateRange[0];
    //     const endDateStr = dateRange[1] || dateRange[0];

    //     query.andWhere(
    //       `
    //       EXISTS (
    //         SELECT 1
    //         FROM unnest(lote."fertilizerDate") AS fd
    //         WHERE fd::date BETWEEN :startDate AND :endDate
    //       )
    //     `,
    //       {
    //         startDate: startDateStr.split('T')[0],
    //         endDate: endDateStr.split('T')[0],
    //       },
    //     );
    //   } catch (error) {
    //     console.error('Error processing dates:', error);
    //     throw new Error('Invalid date format');
    //   }
    // }

    return query.getMany();
    // return query.getRawMany();

    // return (await batchs).map((batch) => ({
    //   ...batch,
    // }));
  }

  async findOne(id: string) {
    let batch: Lote;
    if (isUUID(id)) {
      batch = await this.loteRepository.findOneBy({ id });
    }
    if (!batch) throw new NotFoundException(`Batch with id ${id} not found`);
    return batch;
  }

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map((image) => image.url),
    };
  }

  async update(id: string, updateLoteDto: UpdateLoteDto) {
    const existingBatch = await this.findOne(id);
    const {
      fertilizerDate,
      plantingDate,
      cleanedDate,
      fumigatedDate,
      images,
      ...updateBatch
    } = updateLoteDto;
    const batch = await this.loteRepository.preload({
      id: id,
      fertilizerDate: fertilizerDate ?? existingBatch.fertilizerDate,
      plantingDate: plantingDate ?? existingBatch.plantingDate,
      cleanedDate: cleanedDate ?? existingBatch.cleanedDate,
      fumigatedDate: fumigatedDate ?? existingBatch.fumigatedDate,
      // fertilizerDate: fertilizerDate
      //   ? [...(existingBatch.fertilizerDate || []), ...fertilizerDate]
      //   : existingBatch.fertilizerDate,
      // plantingDate: plantingDate
      //   ? [...(existingBatch.plantingDate || []), ...plantingDate]
      //   : existingBatch.plantingDate,
      // cleanedDate: cleanedDate
      //   ? [...(existingBatch.cleanedDate || []), ...cleanedDate]
      //   : existingBatch.cleanedDate,
      ...updateBatch,
    });
    if (!batch) throw new NotFoundException(`Batch with id ${id} not found`);

    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (images) {
        await queryRunner.manager.delete(LoteImage, { lote: { id } });
      }
      await queryRunner.manager.save(batch);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleExceptions(error);
    }
    return batch;
  }

  async remove(id: string) {
    const batch = await this.findOne(id);
    await this.loteRepository.remove(batch);
  }

  private handleExceptions(error: any) {
    if (error.code === '23502') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, catch server logs',
    );
  }
}
