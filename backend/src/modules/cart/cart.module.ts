import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "../products/entities/product.entity";
import { CartController } from "./cart.controller";
import { CartRepository } from "./cart.repository";
import { CartService } from "./cart.service";
import { OrdersModule } from "../orders/orders.module";
import { UsersModule } from "../users/users.module";
import { CartItem } from "./entities/cartItem.entity";
import { Cart } from "./entities/cart.entity";

@Module({
    imports: [
      TypeOrmModule.forFeature([Cart, CartItem, Product]),
      OrdersModule,
      UsersModule,
    ],
    controllers: [CartController],
    providers: [CartService, CartRepository],
  })
  export class ProductsModule {}