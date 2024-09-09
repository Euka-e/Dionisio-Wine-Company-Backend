import { IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateDiscountCodeDto {
  @ApiProperty({
    description: 'Percentage of the discount',
    example: 15,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  percentage: number;
}
