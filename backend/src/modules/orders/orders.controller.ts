import { UsersRepository } from 'src/modules/users/users.repository';
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
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from '../auth/guards/authorization.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Role } from '../users/dto/roles.enum';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly usersRepository: UsersRepository
  ) { }

  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  async getOrders() {
    return await this.ordersService.getOrders();
  }

  @Get(':id')
  @Roles(Role.User, Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  async getOrdersByUserId(@Param('userId') userId: string) {
    return await this.ordersService.getOrdersByUserId(userId);
  }

  @Post('create/:userId')
  @Roles(Role.User, Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
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

  @Put('orderSatus')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  async updateOrderStatus(
    @Body() order: UpdateOrderDto
  ) {
    return await this.ordersService.updateOrderStatus(order);
  }

  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete('remove/:userId')
  async deleteOrdersFromUser(@Param('userId') userId: string) {
    return await this.ordersService.deleteOrdersFromUser(userId);
  }

}
