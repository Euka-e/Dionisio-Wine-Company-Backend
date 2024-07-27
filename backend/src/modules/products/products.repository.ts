import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async findAll(page: number, limit: number) {
    let products = await this.productsRepository.find({
      relations: { category: true },
    });

    const start = (page - 1) * limit;
    const end = start + limit;
    products = products.slice(start, end);

    return products;
  }

  async findOne(product_id: string) {
    try {
      const options: FindOneOptions<Product> = {
        where: { id: product_id },
        relations: ['categories'],
      };
      const product = await this.productsRepository.findOne(options);
      if (!product) {
        throw new NotFoundException(
          `El producto con el id ${product_id} no pudo ser encontrado.`,
        );
      }
      return product;
    } catch (error) {
      throw new NotFoundException(
        `El producto con el id ${product_id} no pudo ser encontrado.`,
      );
    }
  }

  async create(product: Product) {
    try {
      const newProduct = await this.productsRepository.save(product);
      const findProduct = await this.productsRepository.findOneBy({
        id: newProduct.id,
      });
      return { message: 'Producto añadido', findProduct };
    } catch (error) {
      console.error('Error al añadir el producto', error.message);
      throw new InternalServerErrorException('No se pudo añadir el producto.');
    }
  }

  async update(product_id: string, updateProductDto: UpdateProductDto) {
    await this.productsRepository.update(product_id, updateProductDto);
    return 'Producto Actualizado';
  }

  async remove(product_id: string) {
    const product = await this.productsRepository.findOneBy({
      id: product_id,
    });
    this.productsRepository.remove(product);
    return 'Producto Eliminado';
  }
}
