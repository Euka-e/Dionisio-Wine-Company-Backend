import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async findAll(page: number, limit: number) {
    let products = await this.productsRepository.find();

    const start = (page - 1) * limit;
    const end = start + limit;
    products = products.slice(start, end);

    return products;
  }

  async findOne(products_id: string) {
    const product = await this.productsRepository.findOneBy({
      id: products_id,
    });

    return product;
  }

  async create(createProductDto: CreateProductDto) {
    const product = new Product();

    product.name = createProductDto.name;
    product.description = createProductDto.description;
    product.price = createProductDto.price;
    product.stock = createProductDto.stock;
    product.imgUrl = createProductDto.imgUrl;
    product.type = createProductDto.type;
    product.store = createProductDto.store;

    //* Verificar como se va a manejar la logica de Category

    await this.productsRepository
      .createQueryBuilder()
      .insert()
      .into(Product)
      .values(product)
      .orUpdate(
        ['description', 'price', 'stock', 'imgUrl', 'type', 'store'],
        ['name'],
      )
      .execute();

    return 'Producto agregado';
  }

  async update(products_id: string, updateProductDto: UpdateProductDto) {
    await this.productsRepository.update(products_id, updateProductDto);
    return 'Producto Actualizado';
  }

  async remove(products_id: string) {
    const product = await this.productsRepository.findOneBy({
      id: products_id,
    });
    this.productsRepository.remove(product);
    return 'Producto Eliminado';
  }
}
