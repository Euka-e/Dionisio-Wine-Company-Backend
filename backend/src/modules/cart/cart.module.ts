import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "../products/entities/product.entity";
import { CartController } from "./cart.controller";
import { CartRepository } from "./cart.repository";
import { CartService } from "./cart.service";
import { OrdersModule } from "../orders/orders.module";
import { UsersModule } from "../users/users.module";
import { CartDetail } from "./entities/cartdetail.entity";
import { Cart } from "./entities/cart.entity";
import { User } from "../users/entities/user.entity";
import { CartItem } from "./entities/cart.item.entity";

@Module({
    imports: [
      TypeOrmModule.forFeature([Cart, CartDetail, Product, User, CartItem]),
      OrdersModule,
      UsersModule,

    ],
    controllers: [CartController],
    providers: [CartService, CartRepository],
  })
  export class CartModule {}