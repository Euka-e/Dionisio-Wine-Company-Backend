import { Injectable } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) { }
  findAll(page: number, limit: number) {
    return this.productsRepository.findAll(page, limit);
  }

  findOne(products_id: string) {
    return this.productsRepository.findOne(products_id);
  }

  create(product: Product) {
    return this.productsRepository.create(product);
  }

  update(products_id: string, updateProductDto: UpdateProductDto) {
    return this.productsRepository.update(products_id, updateProductDto);
  }

  remove(products_id: string) {
    return this.productsRepository.remove(products_id);
  }
}
