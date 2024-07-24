import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}
  findAll(page: number, limit: number) {
    return this.productsRepository.findAll(page, limit);
  }

  findOne(products_id: string) {
    return this.productsRepository.findOne(products_id);
  }

  create(createProductDto: CreateProductDto) {
    return this.productsRepository.create(createProductDto);
  }

  update(products_id: string, updateProductDto: UpdateProductDto) {
    return this.productsRepository.update(products_id, updateProductDto);
  }

  remove(products_id: string) {
    return this.productsRepository.remove(products_id);
  }
}
