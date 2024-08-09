import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/orderdetail.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { CartDetail } from '../cart/entities/cartdetail.entity';
import { Cart } from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cart.item.entity';
import { CartService } from '../cart/cart.service';
import { CartRepository } from '../cart/cart.repository';
import { UsersRepository } from '../users/users.repository';
import { MailingService } from '../mailing/mailing.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail, User, Product,Cart,CartDetail, Cart, CartItem, CartDetail]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository,CartService,CartRepository, UsersRepository,MailingService],
  exports: [OrdersRepository],
})
export class OrdersModule {}
