import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApplyDiscountCodeDto {
  @ApiProperty({
    description: 'Discount code',
    example: 'ABCD1234',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
