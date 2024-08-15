import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/modules/categories/entities/category.entity';

export class updateProductDto extends PartialType(
  PickType(CreateProductDto, [
    'name',
    'description',
    'price',
    'stock',
    'imgUrl',
    'store',
    'category',
  ] as const),
) {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Red Wine',
    required: false, // Esto marca el campo como opcional
  })
  name?: string;

  @ApiProperty({
    description: 'A brief description of the product',
    example: 'A fine red wine with notes of cherry and oak.',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 19.99,
    required: false,
  })
  price?: number;

  @ApiProperty({
    description: 'The stock quantity of the product',
    example: 100,
    required: false,
  })
  stock?: number;

  @ApiProperty({
    description: 'The image URL of the product',
    example: 'https://example.com/images/red-wine.jpg',
    required: false,
  })
  imgUrl?: string;

  @ApiProperty({
    description: 'The store where the product is available',
    example: 'Wine Store',
    required: false,
  })
  store?: string;

  @ApiProperty({
    description: 'Category of the product',
    required: false,
    type: () => Category,
  })
  category?: Category;
}

/* import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class updateProductDto extends PartialType(
  PickType(CreateProductDto, [
    'name',
    'description',
    'price',
    'stock',
    'imgUrl',
    'store',
    'category',
    'description',
  ] as const),
) {}
 */