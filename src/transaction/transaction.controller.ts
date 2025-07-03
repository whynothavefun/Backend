import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { TransactionService } from './transaction.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('mock/:tokenId')
  @ApiOperation({
    summary: 'Get mocked transactions of a token',
  })
  @ApiResponse({
    status: 200,
    description: 'Mocked transactions fetched successfully',
  })
  async getTransactionsMock(@Param('tokenId') tokenId: string, @Res() response: Response): Promise<any> {
    const result = await this.transactionService.getAllTransactions(tokenId);
    if (result.success === true) {
      response.status(200).json(result.data);
    } else {
      response.status(500).json({ message: `Internal Server Error: ${result.error}` });
    }
  }
}
