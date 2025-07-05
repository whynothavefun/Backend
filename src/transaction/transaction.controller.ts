import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { TransactionService } from './transaction.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('mock/:tokenId')
  @ApiOperation({
    summary: 'Generate transactions for a token',
  })
  generateTransactions(@Param('tokenId') tokenId: string, @Res() response: Response): void {
    this.transactionService.generateTransactions(tokenId);
    response.status(200).json({ message: 'Transactions generating...' });
  }

  @Get('/:tokenId/clear')
  @ApiOperation({
    summary: 'Clear database for a token',
  })
  async clearDatabase(@Param('tokenId') tokenId: string, @Res() response: Response): Promise<any> {
    const result = await this.transactionService.clearDatabase(tokenId);
    if (result.success === true) {
      response.status(200).json({ message: 'Database cleared successfully' });
    } else {
      response.status(500).json({ message: `Internal Server Error: ${result.error}` });
    }
  }

  @Get('/:tokenId')
  @ApiOperation({
    summary: 'Get all transactions for a token',
  })
  @ApiResponse({
    status: 200,
    description: 'Transactions fetched successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Token not found',
  })
  async getAllTransactions(@Param('tokenId') tokenId: string, @Res() response: Response): Promise<any> {
    const result = await this.transactionService.getAllTransactions(tokenId);
    if (result.success === true) {
      response.status(200).json(result.data);
    } else {
      response.status(500).json({ message: `Internal Server Error: ${result.error}` });
    }
  }
}
