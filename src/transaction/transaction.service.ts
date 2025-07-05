import { Injectable } from '@nestjs/common';
import { ApiResponse } from 'src/common/types/api-response';
import { TransactionsModel } from './models/transactions-mock.entity';
import { InjectModel } from '@nestjs/sequelize';
import { TokenModel } from 'src/token/models/token.entity';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from 'src/common/types/transaction';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(TransactionsModel)
    private readonly transactionModel: typeof TransactionsModel,
    @InjectModel(TokenModel)
    private readonly tokenModel: typeof TokenModel,
  ) {}

  async createRandomTransactionsForAllTokens(tokenId: string): Promise<void> {
    const token = await this.tokenModel.findByPk(tokenId);
    if (!token) {
      throw new Error(`Token with ID ${tokenId} not found`);
    }

    await this.transactionModel.create({
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

  generateTransactions(tokenId: string): void {
    const startTime = Date.now();
    const duration = 60000;

    const generateOne = async () => {
      try {
        await this.createRandomTransactionsForAllTokens(tokenId);
      } catch (error) {
        console.error('Error generating transaction:', error);
      }
    };

    const generateContinuously = async () => {
      while (Date.now() - startTime < duration) {
        await generateOne();
      }
    };

    generateContinuously();
  }

  async clearDatabase(tokenId: string): Promise<ApiResponse> {
    try {
      const token = await this.tokenModel.findByPk(tokenId);
      if (!token) {
        throw new Error(`Token with ID ${tokenId} not found`);
      }
      await this.transactionModel.destroy({ where: { tokenId: tokenId } });
      return { success: true, message: 'Database cleared successfully' };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to clear database' };
    }
  }

  async getAllTransactions(tokenId: string): Promise<ApiResponse<Transaction[]>> {
    try {
      const token = await this.tokenModel.findByPk(tokenId);
      if (!token) {
        return { success: false, error: 'Token not found' };
      }

      const transactions = await this.transactionModel.findAll({
        where: { tokenId: tokenId },
        order: [['createdAt', 'DESC']],
      });
      return { success: true, data: transactions as Transaction[] };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get transactions',
      };
    }
  }
}
