import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { AuthModule } from '../auth/auth.module';
import { OrdersRepository } from './orders.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { order } from './entities/order.entity';
import { OrderDetail } from './entities/orderDetail.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([order, OrderDetail, User, Product]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule { }
