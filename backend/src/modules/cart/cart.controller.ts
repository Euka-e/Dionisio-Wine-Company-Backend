import { Body, Controller, Param, Post } from "@nestjs/common";
import { CartService } from "./cart.service";
import { ApiParam, ApiTags } from "@nestjs/swagger";


@Controller('cart')
@ApiTags('Cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post(':userId/item')
  @ApiParam({ name: 'userId', required: true, description: 'The ID of the user' })
  async addItem(
    @Param('userId') userId: string,
    @Body() products: { id: string, quantity: number }[],
  ) {
    return this.cartService.addItem(userId, products);
  }

  @Post(':userId/checkout')
  @ApiParam({ name: 'userId', required: true, description: 'The ID of the user' })
  async checkout(@Param('userId') userId: string) {
    await this.cartService.checkout(userId);
  }

  // Otros endpoints como removeItem
}
