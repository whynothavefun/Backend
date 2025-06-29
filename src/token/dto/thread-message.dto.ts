import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTokenThreadMessageDto {
  @ApiProperty({
    description: 'Comment or message content for the token discussion thread',
    example: 'Hello there!',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'The wallet address of the user who is creating the message',
    example: '0x75fF6787445c1132cE965b408Adee6bdD4ef653d',
  })
  @IsString()
  @IsNotEmpty()
  userWallet: string;
}

export class LikeOrUnlikeTokenThreadMessageDto {
  @ApiProperty({
    description: 'The wallet address of the user who is liking the message',
    example: '0x75fF6787445c1132cE965b408Adee6bdD4ef653d',
  })
  @IsNotEmpty()
  @IsString()
  userWallet: string;
}

export class CreateTokenThreadMessageReplyDto {
  @ApiProperty({
    description: 'The message content for the reply',
    example: 'General Kenobi!',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'The wallet address of the user who is creating the reply',
    example: '0x75fF6787445c1132cE965b408Adee6bdD4ef653d',
  })
  @IsString()
  @IsNotEmpty()
  userWallet: string;
}
