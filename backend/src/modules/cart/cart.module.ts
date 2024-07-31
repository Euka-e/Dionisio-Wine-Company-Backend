import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "../products/entities/product.entity";
import { CartController } from "./cart.controller";
import { CartRepository } from "./cart.repository";
import { CartService } from "./cart.service";

@Module({
    imports: [TypeOrmModule.forFeature([Product])],
    controllers: [CartController],
    providers: [CartService, CartRepository],
  })
  export class ProductsModule {}