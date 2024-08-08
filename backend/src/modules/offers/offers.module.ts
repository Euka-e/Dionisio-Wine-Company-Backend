import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { Offer } from './entities/offer.entity';
import { Product } from '../products/entities/product.entity';
import { OffersRepository } from './offers.repository';
import { Category } from '../categories/entities/category.entity';
import { DiscountCode } from './entities/discountCode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, Product, Category, DiscountCode])],
  controllers: [OffersController],
  providers: [OffersService, OffersRepository],
})
export class OffersModule {}
