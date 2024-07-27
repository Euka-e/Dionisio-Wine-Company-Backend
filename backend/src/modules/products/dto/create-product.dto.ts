import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsPositive, IsOptional, IsUrl, IsBoolean } from 'class-validator';
import { Category } from '../../categories/entities/category.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { OrderDetail } from '../../orders/entities/orderDetail.entity';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Red Wine'
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A brief description of the product',
    example: 'A fine red wine with notes of cherry and oak.'
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 19.99
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'The stock quantity of the product',
    example: 100
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  stock: number;

  @ApiProperty({
    description: 'The image URL of the product',
    example: 'https://example.com/images/red-wine.jpg'
  })
  @IsUrl()
  @IsNotEmpty()
  imgUrl: string;

  @ApiProperty({
    description: 'The store where the product is available',
    example: 'Wine Store'
  })
  @IsNotEmpty()
  @IsString()
  store: string;

  @ApiProperty({
    description: 'Active status of the product',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Offer associated with the product',
    type: () => Offer
  })
  @IsOptional()
  offers?: Offer;

  @ApiProperty({
    description: 'Category of the product',
    type: () => Category
  })
  @IsOptional()
  category: Category;

  @ApiProperty({
    description: 'Order details associated with the product',
    type: () => [OrderDetail]
  })
  @IsOptional()
  orderDetails?: OrderDetail[];
}
