import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class TokenIdDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the token',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  tokenId: string;
}
