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
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly usersRepository: UsersRepository
  ) { }

  @Post('create/:userId')
  async create(
    @Param('userId') userId: string,
    @Body() createOrderDto: CreateOrderDto
  ) {
    const user = await this.usersRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      return await this.ordersService.createOrderFromCart(createOrderDto, userId);
    } catch (error) {
      throw new BadRequestException('Error creating order');
    }
  }
}
