import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { configModuleConfig } from './config/config-module';
import { TokenModule } from './token/token.module';
import { TokenModel } from './token/models/token.entity';
import { ThreadMessageModel } from './token/models/thread-messages.entity';
import { MessageLikesModel } from './token/models/message-likes.entity';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { APP_GUARD } from '@nestjs/core';
import { TransactionModule } from './transaction/transaction.module';
import { TransactionsMockModel } from './transaction/models/transactions-mock.entity';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleConfig),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('PG_HOST'),
        port: configService.get('PG_PORT'),
        username: configService.get('PG_USER'),
        password: configService.get('PG_PASSWORD'),
        database: configService.get('PG_DATABASE'),
        autoLoadModels: configService.get('AUTO_LOAD_SEQUELIZE_MODELS'),
        synchronize: configService.get('SYNCHRONIZE_SEQUELIZE'),
        models: [TokenModel, ThreadMessageModel, MessageLikesModel, TransactionsMockModel],
        logging: false,
      }),
    }),
    TokenModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule {}
