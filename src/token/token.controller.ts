import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateTokenDto } from './dto/create-token.dto';
import { TokenSortField } from 'src/common/types/token';
import { SortOrder } from 'src/common/types/sort';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CreateTokenThreadMessageDto,
  CreateTokenThreadMessageReplyDto,
  GetTokenThreadMessageDto,
  LikeOrUnlikeTokenThreadMessageDto,
} from './dto/thread-message.dto';

@Controller('tokens')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get('')
  @ApiOperation({
    summary: 'Get all tokens with optional search',
  })
  @ApiQuery({
    name: 'q',
    description: 'Search query - partial token name or symbol (optional)',
    required: false,
    example: 'ET',
  })
  @ApiQuery({
    name: 'sortBy',
    description: 'Field to sort tokens by (mcap, volume_24h, price_change_24h, createdAt)',
    enum: TokenSortField,
    required: false,
    example: TokenSortField.CREATED_AT,
  })
  @ApiQuery({
    name: 'order',
    description: 'Sort order: asc for ascending, desc for descending.',
    enum: SortOrder,
    required: false,
    example: SortOrder.DESC,
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens fetched successfully',
  })
  async getAllTokens(
    @Res() response: Response,
    @Query('q') searchQuery?: string,
    @Query('sortBy') sortBy: TokenSortField = TokenSortField.CREATED_AT,
    @Query('order') order: SortOrder = SortOrder.DESC,
  ): Promise<any> {
    const result = await this.tokenService.getAllTokens(sortBy, order, searchQuery);
    if (result.success === true) {
      response.status(200).json(result.data);
    } else {
      response.status(500).json({ message: `Internal Server Error: ${result.error}` });
    }
  }

  @Post('/create-token')
  @ApiOperation({
    summary: 'Allows to launch a new token',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        artwork: { type: 'string', format: 'binary', description: 'Image file (optional)' },
        tokenName: { type: 'string' },
        tokenSymbol: { type: 'string' },
        userWallet: { type: 'string' },
      },
      required: ['tokenName', 'tokenSymbol', 'artwork', 'userWallet'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Token created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Artwork file is required',
  })
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('artwork'))
  async createToken(
    @UploadedFile()
    artwork: {
      buffer: Buffer;
      originalname: string;
      mimetype: string;
    },
    @Body() tokenInfo: CreateTokenDto,
    @Res() response: Response,
  ): Promise<any> {
    if (!artwork) {
      throw new BadRequestException('Artwork file is required');
    }

    const result = await this.tokenService.createToken(artwork, tokenInfo);
    if (result.success === true) {
      response.status(201).json({ message: 'Token created successfully' });
    } else {
      response.status(500).json({ message: `Internal Server Error: ${result.error}` });
    }
  }

  @Get('/thread')
  @ApiOperation({
    summary: 'Get thread for a token',
  })
  @ApiQuery({
    name: 'order',
    description: 'Sort order: asc for ascending, desc for descending.',
    enum: SortOrder,
    required: false,
    example: SortOrder.DESC,
  })
  @ApiResponse({
    status: 200,
    description: 'Thread fetched successfully',
  })
  async getTokenThread(
    @Body() getTokenThreadMessageDto: GetTokenThreadMessageDto,
    @Query('order') order: SortOrder = SortOrder.DESC,
    @Res() response: Response,
  ): Promise<any> {
    const result = await this.tokenService.getTokenThread(getTokenThreadMessageDto.tokenId, order);
    if (result.success === true) {
      response.status(200).json(result.data);
    } else {
      response.status(500).json({ message: `Internal Server Error: ${result.error}` });
    }
  }

  @Post('/thread')
  @ApiOperation({
    summary: 'Create a new message in the token thread',
  })
  @ApiResponse({
    status: 201,
    description: 'Message created successfully',
  })
  @UsePipes(new ValidationPipe())
  async createTokenThreadMessage(
    @Body() createThreadMessageDto: CreateTokenThreadMessageDto,
    @Res() response: Response,
  ): Promise<any> {
    const result = await this.tokenService.createTokenThreadMessage(createThreadMessageDto);
    if (result.success === true) {
      response.status(201).json({ message: 'Message created successfully' });
    } else {
      response.status(500).json({ message: `Internal Server Error: ${result.error}` });
    }
  }

  @Post('/thread/like')
  @ApiOperation({
    summary: 'Like a message in the token thread. Use the same endpoint to unlike a message.',
  })
  @ApiResponse({
    status: 201,
    description: 'Message liked successfully',
  })
  @UsePipes(new ValidationPipe())
  async likeOrUnlikeTokenThreadMessage(
    @Body() likeTokenThreadMessageDto: LikeOrUnlikeTokenThreadMessageDto,
    @Res() response: Response,
  ): Promise<any> {
    const result = await this.tokenService.likeOrUnlikeTokenThreadMessage(likeTokenThreadMessageDto);
    if (result.success === true) {
      response.status(201).json({ message: 'Message liked/unliked successfully' });
    } else {
      response.status(500).json({ message: `Internal Server Error: ${result.error}` });
    }
  }

  @Post('/thread/reply')
  @ApiOperation({
    summary: 'Reply to a message in the token thread',
  })
  @ApiResponse({
    status: 201,
    description: 'Reply created successfully',
  })
  async createTokenThreadMessageReply(
    @Body() createThreadMessageReplyDto: CreateTokenThreadMessageReplyDto,
    @Res() response: Response,
  ): Promise<any> {
    const result = await this.tokenService.createTokenThreadMessageReply(createThreadMessageReplyDto);
    if (result.success === true) {
      response.status(201).json({ message: 'Reply created successfully' });
    } else {
      response.status(500).json({ message: `Internal Server Error: ${result.error}` });
    }
  }
}
