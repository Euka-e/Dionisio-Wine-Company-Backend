import { UsersRepository } from 'src/modules/users/users.repository';
import { CartService } from './../cart/cart.service';
import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../users/dto/roles.enum';
import { AuthGuard } from '../auth/guards/authorization.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
@ApiTags('Orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly usersRepository: UsersRepository
  ) { }

  @Get('/orders')
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  async getOrders() {
    return await this.ordersService.getOrders();
  }

  @Post('create/:userId')
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  async create(
    @Param('userId') userId: string,
    @Body() cartItems: CreateOrderDto
  ) {
    const findUser = await this.usersRepository.getUserById(userId);
    if (findUser) {
      const order = await this.ordersService.createOrderFromCart(cartItems, userId);
      return order;
    } else {
      throw new NotFoundException('Order creation failed');
    }
  }
}
