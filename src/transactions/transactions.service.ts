import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { DataSource, Repository } from 'typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger('LotesService');
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    private readonly datasource: DataSource,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    try {
      const { ...creteTransaction } = createTransactionDto;
      const transaction = this.transactionsRepository.create({
        ...createTransactionDto,
      });
      await this.transactionsRepository.save(transaction);
      return { ...creteTransaction };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(
    queryTransactionDto: QueryTransactionDto,
    year: number,
    month: number,
  ) {
    // const transactions = this.transactionsRepository.find({});
    // return (await transactions).map((transaction) => ({
    //   ...transaction,
    // }));

    const query = this.transactionsRepository.createQueryBuilder('transaction');

    if (queryTransactionDto.type) {
      query.andWhere('transaction.type =:type', {
        type: queryTransactionDto.type,
      });
    }

    if (queryTransactionDto.transactionDate) {
      query.andWhere('transaction.transactionDate =:transactionDate', {
        transactionDate: queryTransactionDto.transactionDate,
      });
    }

    if (queryTransactionDto.transactionYear) {
      query.andWhere("DATE_PART('year', transaction.transactionDate) = :year", {
        year: queryTransactionDto.transactionYear,
      });
    }

    if (queryTransactionDto.transactionMonth) {
      query.andWhere(
        "DATE_PART('month', transaction.transactionDate) = :month",
        {
          month: queryTransactionDto.transactionMonth,
        },
      );
    }

    return query.getMany();
  }

  async findOne(id: string) {
    let transaction: Transaction;
    if (isUUID(id)) {
      transaction = await this.transactionsRepository.findOneBy({ id });
    }
    if (!transaction)
      throw new NotFoundException(`Trnasaction whit id ${id} not found`);
    return transaction;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    const { ...updateTransaction } = updateTransactionDto;
    const transaction = await this.transactionsRepository.preload({
      id: id,
      ...updateTransaction,
    });
    if (!transaction)
      throw new NotFoundException(`Transaction with id ${id} not found`);
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(transaction);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return transaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const transaction = await this.findOne(id);
    await this.transactionsRepository.remove(transaction);
  }

  private handleExceptions(error: any) {
    if (error.code === '23502') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, catch server logs',
    );
  }
}
