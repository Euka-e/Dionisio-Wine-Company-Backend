import { Body, Controller, Param, Post } from "@nestjs/common";
import { Cart } from "./entities/cart.entity";
import { CartService } from "./cart.service";
import { order } from "../orders/entities/order.entity";


@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async createCart(@Body('userId') userId: string): Promise<Cart> {
    return await this.cartService.createCart(userId);
  }

  @Post(':cartId/item')
  async addItemToCart(
    @Param('cartId') cartId: string,
    @Body('productId') productId: string,
    @Body('quantity') quantity: number
  ): Promise<Cart> {
    return await this.cartService.addItemToCart(cartId, productId, quantity);
  }

  @Post(':id/checkout')
  async checkout(@Param('id') cartId: string): Promise<order> {
    return await this.cartService.checkout(cartId);
  }


  
  // Otros endpoints como removeItem
}
