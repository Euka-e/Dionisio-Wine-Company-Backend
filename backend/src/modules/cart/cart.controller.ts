import { Body, Controller, Param, Post } from "@nestjs/common";
import { Cart } from "./entities/cart.entity";
import { CartService } from "./cart.service";

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

  // Otros endpoints como removeItem
}
