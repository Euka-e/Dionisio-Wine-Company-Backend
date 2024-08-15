import { Injectable } from '@nestjs/common';
import { updateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  findAll(/* page: number = 1, limit: number = 10 */) {
    return this.productsRepository.findAll(/* page, limit */);
  }

  findOne(product_id: string) {
    return this.productsRepository.findOne(product_id);
  }

  create(product: Product) {
    return this.productsRepository.create(product);
  }

  restock(product_id: string, stock: number) {
    return this.productsRepository.restock(product_id, stock);
  }

  update(product_id: string, updateProductDto: any) {
    return this.productsRepository.update(product_id, updateProductDto);
  }

  remove(product_id: string) {
    return this.productsRepository.remove(product_id);
  }
}
