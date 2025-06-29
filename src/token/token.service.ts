import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TokenModel } from './models/token.entity';
import { CreateTokenDto } from './dto/create-token.dto';
import { TokenSortField, Token } from 'src/common/types/token';
import { SortOrder } from 'src/common/types/sort';
import { ThreadMessageWithReplies } from 'src/common/types/token';
import { ThreadMessageModel } from 'src/token/models/thread-messages.entity';
import {
  CreateTokenThreadMessageDto,
  CreateTokenThreadMessageReplyDto,
  LikeOrUnlikeTokenThreadMessageDto,
} from './dto/thread-message.dto';
import { uploadToPinata } from '../pinata/index';
import { Sequelize } from 'sequelize-typescript';
import { MessageLikesModel } from 'src/token/models/message-likes.entity';
import { ApiResponse } from 'src/common/types/api-response';
import { Op } from 'sequelize';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(TokenModel) private readonly tokenModel: typeof TokenModel,
    @InjectModel(ThreadMessageModel) private readonly threadMessageModel: typeof ThreadMessageModel,
    @InjectModel(MessageLikesModel) private readonly messageLikesModel: typeof MessageLikesModel,
  ) {}

  async getAllTokens(sortBy: TokenSortField, order: SortOrder, searchQuery?: string): Promise<ApiResponse<Token[]>> {
    try {
      const whereClause = searchQuery
        ? {
            [Op.or]: [
              {
                tokenName: {
                  [Op.iLike]: `%${searchQuery}%`,
                },
              },
              {
                tokenSymbol: {
                  [Op.iLike]: `%${searchQuery}%`,
                },
              },
            ],
          }
        : {};

      const tokens: Token[] = await this.tokenModel.findAll({
        where: whereClause,
        order: [[sortBy, order]],
      });
      return { success: true, data: tokens };
    } catch (error: any) {
      return { success: false, error: error };
    }
  }

  async createToken(
    artwork: {
      buffer: Buffer;
      originalname: string;
      mimetype: string;
    },
    createTokenDto: CreateTokenDto,
  ): Promise<ApiResponse> {
    try {
      const artworkUrl = await uploadToPinata(artwork);

      await this.tokenModel.create({
        tokenName: createTokenDto.tokenName,
        tokenSymbol: createTokenDto.tokenSymbol,
        userWallet: createTokenDto.userWallet,
        artwork: artworkUrl,
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error };
    }
  }

  async getTokenThread(tokenId: string, sortOrder: SortOrder): Promise<ApiResponse<ThreadMessageWithReplies[]>> {
    try {
      const thread = await this.getThreadsWithReplies(tokenId, sortOrder);
      return { success: true, data: thread };
    } catch (error: any) {
      return { success: false, error: error };
    }
  }

  async createTokenThreadMessage(createThreadMessageDto: CreateTokenThreadMessageDto): Promise<ApiResponse> {
    try {
      const tokenExists = await this.checkTokenExists(createThreadMessageDto.tokenId);
      if (!tokenExists.success) {
        return tokenExists;
      }

      await this.threadMessageModel.create({
        tokenId: createThreadMessageDto.tokenId,
        message: createThreadMessageDto.message,
        userWallet: createThreadMessageDto.userWallet,
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error };
    }
  }

  async likeOrUnlikeTokenThreadMessage(
    likeTokenThreadMessageDto: LikeOrUnlikeTokenThreadMessageDto,
  ): Promise<ApiResponse> {
    try {
      const messageLike = await this.messageLikesModel.findOne({
        where: {
          messageId: likeTokenThreadMessageDto.messageId,
          tokenId: likeTokenThreadMessageDto.tokenId,
          userWallet: likeTokenThreadMessageDto.userWallet,
        },
      });
      const tokenExists = await this.checkTokenExists(likeTokenThreadMessageDto.tokenId);
      if (!tokenExists.success) {
        return tokenExists;
      }
      const messageExists = await this.checkMessageExists(likeTokenThreadMessageDto.messageId);
      if (!messageExists.success) {
        return messageExists;
      }

      if (messageLike) {
        await this.messageLikesModel.destroy({
          where: {
            messageId: likeTokenThreadMessageDto.messageId,
            tokenId: likeTokenThreadMessageDto.tokenId,
            userWallet: likeTokenThreadMessageDto.userWallet,
          },
        });
        await this.threadMessageModel.update(
          {
            likeCount: Sequelize.literal('"likeCount" - 1'),
          },
          {
            where: {
              id: likeTokenThreadMessageDto.messageId,
            },
          },
        );
        return { success: true };
      } else {
        await this.messageLikesModel.create({
          messageId: likeTokenThreadMessageDto.messageId,
          tokenId: likeTokenThreadMessageDto.tokenId,
          userWallet: likeTokenThreadMessageDto.userWallet,
        });
        await this.threadMessageModel.update(
          {
            likeCount: Sequelize.literal('"likeCount" + 1'),
          },
          {
            where: {
              id: likeTokenThreadMessageDto.messageId,
            },
          },
        );
        return { success: true };
      }
    } catch (error: any) {
      return { success: false, error: error };
    }
  }

  async createTokenThreadMessageReply(
    createThreadMessageReplyDto: CreateTokenThreadMessageReplyDto,
  ): Promise<ApiResponse> {
    try {
      const tokenExists = await this.checkTokenExists(createThreadMessageReplyDto.tokenId);
      if (!tokenExists.success) {
        return tokenExists;
      }
      const messageExists = await this.checkMessageExists(createThreadMessageReplyDto.messageId);
      if (!messageExists.success) {
        return messageExists;
      }

      await this.threadMessageModel.create({
        tokenId: createThreadMessageReplyDto.tokenId,
        parentId: createThreadMessageReplyDto.messageId,
        message: createThreadMessageReplyDto.message,
        userWallet: createThreadMessageReplyDto.userWallet,
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error };
    }
  }

  async getThreadsWithReplies(tokenId: string, sortOrder: SortOrder): Promise<ThreadMessageWithReplies[]> {
    const messages = await ThreadMessageModel.findAll({
      where: { tokenId },
      order: [['createdAt', sortOrder]],
      raw: true,
    });

    const map = new Map<string, ThreadMessageWithReplies>();
    const roots: ThreadMessageWithReplies[] = [];

    for (const msg of messages) {
      const messageWithReplies: ThreadMessageWithReplies = {
        ...msg,
        replies: [],
      };
      map.set(msg.id, messageWithReplies);
    }

    for (const msg of messages) {
      const messageWithReplies = map.get(msg.id);

      if (msg.parentId) {
        const parent = map.get(msg.parentId);
        if (parent) {
          parent.replies.push(messageWithReplies);
        }
      } else {
        roots.push(messageWithReplies);
      }
    }

    return roots;
  }

  async checkTokenExists(tokenId: string): Promise<ApiResponse> {
    try {
      const token = await this.tokenModel.findOne({
        where: {
          id: tokenId,
        },
      });
      if (!token) {
        return { success: false, error: 'Token not found' };
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error };
    }
  }

  async checkMessageExists(messageId: string): Promise<ApiResponse> {
    try {
      const message = await this.threadMessageModel.findOne({
        where: {
          id: messageId,
        },
      });
      if (!message) {
        return { success: false, error: 'Message not found' };
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error };
    }
  }
}
