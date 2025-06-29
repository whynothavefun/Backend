import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { TokenModel } from './models/token.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { ThreadMessageModel } from 'src/token/models/thread-messages.entity';
import { MessageLikesModel } from 'src/token/models/message-likes.entity';

@Module({
  imports: [SequelizeModule.forFeature([TokenModel, ThreadMessageModel, MessageLikesModel])],
  controllers: [TokenController],
  providers: [TokenService],
})
export class TokenModule {}
