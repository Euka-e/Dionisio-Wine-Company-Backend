import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOfferDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(100)
    discountPercentage: number;
  
    @IsOptional()
    @IsString()
    productId?: string;
  
    @IsOptional()
    @IsString()
    categoryId?: string;
  
    @IsNotEmpty()
    startDate: Date;
  
    @IsNotEmpty()
    endDate: Date;
  }