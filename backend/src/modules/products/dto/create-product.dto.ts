import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsPositive } from 'class-validator';

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
  @IsNotEmpty()
  @IsString()
  imgUrl: string;

  @ApiProperty({
    description: 'The type of the product',
    example: 'wine'
  })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({
    description: 'The store where the product is available',
    example: 'Wine Store'
  })
  @IsNotEmpty()
  @IsString()
  store: string;
}

//lo dejo por las dudas
/* export class CreateProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  imgUrl: string;
  type: string;
  store: string;
} */
