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
  ParseUUIDPipe,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly usersRepository: UsersRepository
  ) { }

  @Get()
  async getOrders() {
    return await this.ordersService.getOrders();
  }

  @Get(':id')
  async getOrdersByUserId(@Param('userId') userId: string) {
    return await this.ordersService.getOrdersByUserId(userId);
  }

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
  
  @Delete('remove/:userId')
  async deleteOrdersFromUser(@Param('userId') userId: string) {
    return await this.ordersService.deleteOrdersFromUser(userId);
  }

}
