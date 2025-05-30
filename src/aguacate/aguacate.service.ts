import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateAguacateDto } from './dto/create-aguacate.dto';
import { UpdateAguacateDto } from './dto/update-aguacate.dto';
import { DataSource, Repository } from 'typeorm';
import { Aguacate } from './entities/aguacate.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class AguacateService {
  private readonly logger = new Logger('LotesService');

  constructor(
    @InjectRepository(Aguacate)
    private readonly aguacateRepository: Repository<Aguacate>,
    private readonly dataSource: DataSource,
  ) {}
  async create(createAguacateDto: CreateAguacateDto) {
    try {
      const { ...createAguacate } = createAguacateDto;
      const aguacate = this.aguacateRepository.create({
        ...createAguacate,
      });
      await this.aguacateRepository.save(aguacate);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    const aguacates = this.aguacateRepository.find({});
    return (await aguacates).map((aguacate) => ({
      ...aguacate,
    }));
  }

  async findOne(id: string) {
    let aguacate: Aguacate;
    if (isUUID(id)) {
      aguacate = await this.aguacateRepository.findOneBy({ id });
    }
    if (!aguacate)
      throw new NotFoundException(`El aguacate con id ${id} no existe`);
    return aguacate;
  }

  async update(id: string, updateAguacateDto: UpdateAguacateDto) {
    const existingAguacate = await this.findOne(id);
    const { fertilizerDate, fumigatedDate, ...updateAguacate } =
      updateAguacateDto;
    const aguacate = await this.aguacateRepository.preload({
      id: id,
      fertilizerDate: fertilizerDate ?? existingAguacate.fertilizerDate,

      fumigatedDate: fumigatedDate ?? existingAguacate.fumigatedDate,

      ...updateAguacate,
    });
    if (!aguacate)
      throw new NotFoundException(`el aguacate con el id ${id} no existe`);

    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(aguacate);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return aguacate;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleExceptions(error);
    }
    return aguacate;
  }

  remove(id: number) {
    return `This action removes a #${id} aguacate`;
  }

  private handleExceptions(error: any) {
    if (error.code === '23502') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, catch server logs',
    );
  }
}
