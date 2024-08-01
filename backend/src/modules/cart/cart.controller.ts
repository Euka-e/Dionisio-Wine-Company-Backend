import { Body, Controller, Param, Post } from "@nestjs/common";
import { Cart } from "./entities/cart.entity";
import { CartService } from "./cart.service";
import { order } from "../orders/entities/order.entity";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { CartItem } from "./entities/cartItem.entity";


@Controller('cart')
@ApiTags('Cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async createCart(@Param('userId') userId: string): Promise<Cart> {
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
  async checkout(@Param('CartId') cartId: string): Promise<order> {
    return await this.cartService.checkout(cartId);
  }


  
  // Otros endpoints como removeItem
}
