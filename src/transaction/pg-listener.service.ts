import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import createSubscriber from 'pg-listen';
import { TransactionGateway } from './transaction.gateway';
import { Transaction } from 'src/common/types/transaction';

@Injectable()
export class PgListenerService implements OnModuleInit, OnModuleDestroy {
  private subscriber = createSubscriber({ connectionString: process.env.DATABASE_URL });
  private readonly logger = new Logger(PgListenerService.name);

  constructor(private readonly gateway: TransactionGateway) {}

  async onModuleInit() {
    try {
      await this.subscriber.connect();
      await this.subscriber.listenTo('new_transaction');

      this.subscriber.notifications.on('new_transaction', (payload: Transaction) => {
        this.gateway.broadcastTransaction(payload);
      });

      this.subscriber.events.on('error', (err) => {
        this.logger.error('pg-listen error', err);
      });

      process.on('SIGINT', async () => {
        await this.subscriber.close();
        process.exit();
      });
      process.on('SIGTERM', async () => {
        await this.subscriber.close();
        process.exit();
      });
    } catch (err) {
      this.logger.error('pg-listen error', err);
    }
  }

  async onModuleDestroy() {
    await this.subscriber.close();
  }
}
