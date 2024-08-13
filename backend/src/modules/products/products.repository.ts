import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { updateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const [products, total] = await this.productsRepository.findAndCount({
      relations: { category: true },
      take: limit,
      skip: (page - 1) * limit,
    });
    return {
      data: products,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(product_id: string) {
    try {
      const options: FindOneOptions<Product> = {
        where: { productId: product_id },
        relations: ['category'],
      };

      const product = await this.productsRepository.findOne(options);

      if (!product) {
        throw new NotFoundException(
          `El producto con el id ${product_id} no pudo ser encontrado. ERROR PRIMER IF`,
        );
      }
      return product;
    } catch (error) {
      throw new NotFoundException(
        `El producto con el id ${product_id} no pudo ser encontrado. ERROR DEL CATCH`,
      );
    }
  }

  async create(product: Product) {
    try {
      const newProduct = await this.productsRepository.save(product);
      const findProduct = await this.productsRepository.findOneBy({
        productId: newProduct.productId,
      });
      return { message: 'Added Product', findProduct };
    } catch (error) {
      console.error('Error adding product', error.message);
      throw new InternalServerErrorException('Product could not be added');
    }
  }

  async restock(productId: string, stock?: number) {
    try {
      const product = await this.productsRepository.findOne({
        where: { productId },
      });

      if (!product) {
        throw new NotFoundException(`Product with id ${productId} not found`);
      }

      product.stock = stock !== undefined ? stock : 20;

      await this.productsRepository.save(product);

      return `Product has been updated to stock level ${product.stock}`;
    } catch (error) {
      console.error(
        `Error updating stock for product with id ${productId}:`,
        error,
      );
      return `Failed to update stock for product with id ${productId}.`;
    }
  }
  async update(product_id: string, updateProductDto: updateProductDto) {
    try {
      await this.productsRepository.update(product_id, updateProductDto);
      return updateProductDto;
    } catch (error) {
      console.error(
        `Error actualizando el producto con id ${product_id}:`,
        error,
      );
      throw new InternalServerErrorException(
        `No se pudo actualizar el producto con el id ${product_id}.`,
      );
    }
  }

  async remove(product_id: string) {
    const product = await this.productsRepository.findOneBy({
      productId: product_id,
    });
    this.productsRepository.remove(product);
    return 'Deleted Product';
  }
}
