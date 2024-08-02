import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsNumber } from 'class-validator';

export class AddItemDto {
  @ApiProperty({ description: 'The ID of the product to add', example: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  product: string;

  @ApiProperty({ description: 'The quantity of the product to add', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
