import { CartService } from './../cart/cart.service';
import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiTags } from '@nestjs/swagger';
import { CartItem } from '../cart/entities/cart.item.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../users/dto/roles.enum';
import { AuthGuard } from '../auth/guards/authorization.guard';
import { RolesGuard } from '../auth/guards/role.guard';

@Controller('orders')
@ApiTags('Orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly cartService: CartService
  ) { }


  @Post()
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  async create(
    @Param('userId') userId: string,
    @Body() cartItems: CartItem[]
  ) {
    const order = await this.ordersService.createOrderFromCart(cartItems, userId);
    if (order) {
      await this.cartService.clearCart(userId);
    }
    return order;
  }

}
