import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class UpdateOfferDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  discountPercentage?: number;

  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  startDate?: Date;

  @IsOptional()
  endDate?: Date;
}
