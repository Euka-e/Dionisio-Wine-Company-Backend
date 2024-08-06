import {
  Controller,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiTags } from '@nestjs/swagger';
import { CartItem } from '../cart/entities/cart.item.entity';
import { User } from '../users/entities/user.entity';

@Controller('orders')
@ApiTags('Orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }


  @Post()
  create(
    @Param() userId: string,
    @Body() cartItems: CartItem[]
  ) {
    return this.ordersService.createOrderFromCart(cartItems, userId);
  }


}
