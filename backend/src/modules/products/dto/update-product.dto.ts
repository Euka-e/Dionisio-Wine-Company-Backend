import { PartialType, PickType } from '@nestjs/mapped-types';
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
