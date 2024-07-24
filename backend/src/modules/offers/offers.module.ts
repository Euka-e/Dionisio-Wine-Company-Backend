import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { Offer } from './entities/offer.entity';
import { Product } from '../products/entities/product.entity';
import { OffersRepository } from './offers.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, Product])],
  controllers: [OffersController],
  providers: [OffersService, OffersRepository],
})
export class OffersModule {}
