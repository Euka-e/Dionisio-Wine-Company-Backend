import { Body, Controller, Param, Post } from '@nestjs/common';
import { Cart } from './entities/cart.entity';
import { CartService } from './cart.service';
import { Order } from '../orders/entities/order.entity';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { CartItem } from './entities/cartItem.entity';
import { AddItemDto } from './dto/addItem.dto';

@Controller('cart')
@ApiTags('Cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':userId/item')
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'The ID of the user',
  })
  async addItemToCart(
    @Param('userId') userId: string,
    @Body() addItemDto: AddItemDto,
  ) {
    return this.cartService.addItemToCart(
      userId,
      addItemDto.productId,
      addItemDto.quantity,
    );
  }

  @Post(':userId/checkout')
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'The ID of the user',
  })
  async checkout(@Param('userId') userId: string) {
    await this.cartService.checkout(userId);
  }

  // Otros endpoints como removeItem
}
