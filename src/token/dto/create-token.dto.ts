import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenDto {
  @ApiProperty({
    description: 'The name of the token',
    example: 'Ethereum',
  })
  @IsNotEmpty()
  @IsString()
  tokenName: string;

  @ApiProperty({
    description: 'The symbol of the token',
    example: 'ETH',
  })
  @IsNotEmpty()
  @IsString()
  tokenSymbol: string;

  @ApiProperty({
    description: 'The creator wallet of the token',
    example: '0x75fF6787445c1132cE965b408Adee6bdD4ef653d',
  })
  @IsNotEmpty()
  @IsString()
  userWallet: string;
}
