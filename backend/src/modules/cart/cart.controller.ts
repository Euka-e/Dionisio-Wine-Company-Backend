import { Body, Controller, Param, Post } from "@nestjs/common";
import { CartService } from "./cart.service";
import { ApiParam, ApiTags } from "@nestjs/swagger";

@Controller('cart')
@ApiTags('Cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post(':id/item')
  @ApiParam({ name: 'id', required: true, description: 'The ID of the user' })
  async addItem(
    @Param('id') id: string,
    @Body() products: { productId: string, quantity: number }[],
  ) {
    return this.cartService.create(id, products);
  }

  @Post(':id/checkout')
  @ApiParam({ name: 'id', required: true, description: 'The ID of the user' })
  async checkout(@Param('id') id: string) {
    await this.cartService.checkout(id);
  }

  // Otros endpoints como removeItem
}
