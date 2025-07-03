import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionsMockModel } from './models/transactions-mock.entity';
import { TokenModel } from 'src/token/models/token.entity';

@Module({
  imports: [SequelizeModule.forFeature([TransactionsMockModel, TokenModel])],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
