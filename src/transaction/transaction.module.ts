import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionsModel } from './models/transactions-mock.entity';
import { TokenModel } from 'src/token/models/token.entity';
import { TransactionGateway } from './transaction.gateway';
import { PgListenerService } from './pg-listener.service';

@Module({
  imports: [SequelizeModule.forFeature([TransactionsModel, TokenModel])],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionGateway, PgListenerService],
})
export class TransactionModule {}
