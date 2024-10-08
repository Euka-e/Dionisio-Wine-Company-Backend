import { CartDetail } from 'src/modules/cart/entities/cartdetail.entity';
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { OrderDetail } from '../orders/entities/orderdetail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, CartDetail, OrderDetail])],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
