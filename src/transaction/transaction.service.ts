import { Injectable } from '@nestjs/common';
import { ApiResponse } from 'src/common/types/api-response';
import { TransactionsMockModel } from './models/transactions-mock.entity';
import { InjectModel } from '@nestjs/sequelize';
import { TokenModel } from 'src/token/models/token.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(TransactionsMockModel)
    private readonly transactionModel: typeof TransactionsMockModel,
    @InjectModel(TokenModel)
    private readonly tokenModel: typeof TokenModel,
  ) {}

  async createRandomTransactionsForAllTokens(tokenId: string, count: number = 10): Promise<void> {
    const token = await this.tokenModel.findByPk(tokenId);
    if (!token) {
      throw new Error(`Token with ID ${tokenId} not found`);
    }

    const allTransactions = [];
    for (let i = 0; i < count; i++) {
      allTransactions.push({
        id: uuidv4(),
        transactionType: 'buy',
        tokenId: tokenId,
        tokenName: token.tokenName,
        tokenAmount: Math.floor(Math.random() * 1000),
        hypeAmount: Math.floor(Math.random() * 1000),
        transactionHash: uuidv4(),
        userWallet: token.userWallet,
        createdAt: new Date(),
      });
    }
    await this.transactionModel.bulkCreate(allTransactions);
  }

  async getAllTransactions(tokenId: string): Promise<ApiResponse<TransactionsMockModel[]>> {
    try {
      this.createRandomTransactionsForAllTokens(tokenId, 5);
      const transactions = await this.transactionModel.findAll({
        where: { tokenId },
        order: [['createdAt', 'DESC']],
      });
      return { success: true, data: transactions };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get transactions',
      };
    }
  }
}
