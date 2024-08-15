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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('orders')
@ApiTags('Orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly usersRepository: UsersRepository
  ) { }
  
  
  @ApiBearerAuth()
@ApiOperation({
  summary: 'Retrieve all orders',
  description: `This endpoint retrieves a list of all orders in the system.
    - It requires authentication and authorization with either Admin or SuperAdmin role.
    - The response will contain a list of all orders, including their details such as status, total price, and related user information.`,
})
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  async getOrders() {
    return await this.ordersService.getOrders();
  }

  @ApiBearerAuth()
@ApiOperation({
  summary: 'Retrieve orders by user ID',
  description: `This endpoint retrieves all orders associated with a specific user ID.
    - It requires authentication with any user role, including User, Admin, or SuperAdmin.
    - The request parameter should include the user ID, and the response will contain a list of orders related to that user.`,
})
@ApiParam({
  name: 'userId',
  description: 'The ID of the user whose orders are to be retrieved',
  example: '123e4567-e89b-12d3-a456-426614174000',
})
  @Get(':id')
  @Roles(Role.User, Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  async getOrdersByUserId(@Param('userId') userId: string) {
    return await this.ordersService.getOrdersByUserId(userId);
  }

  @ApiBearerAuth()
@ApiOperation({
  summary: 'Create a new order',
  description: `This endpoint creates a new order for the specified user.
    - It requires authentication with any user role, including User, Admin, or SuperAdmin.
    - The request body should include the order details, and the user ID is provided as a URL parameter.
    - If the user is not found, a NotFoundException will be thrown. If there is an issue creating the order, a BadRequestException will be thrown.`,
})
@ApiParam({
  name: 'userId',
  description: 'The ID of the user for whom the order is to be created',
  example: '123e4567-e89b-12d3-a456-426614174000',
})
@ApiBody({
  description: 'Details for creating a new order',
  type: CreateOrderDto,
})
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

  @ApiBearerAuth()
@ApiOperation({
  summary: 'Update the status of an order',
  description: `This endpoint updates the status of an existing order.
    - It requires authentication and authorization with either Admin or SuperAdmin role.
    - The request body should include the order ID and the new status for the order.`,
})
@ApiBody({
  description: 'Details for updating the order status',
  type: UpdateOrderDto,
})
  @Put('orderStatus')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBody({ type: UpdateOrderDto })
  async updateOrderStatus(
    @Body() order: UpdateOrderDto,
  ) {
    return await this.ordersService.updateOrderStatus(order);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete all orders for a user',
    description: `This endpoint deletes all orders associated with a specific user ID.
      - It requires authentication and authorization with either Admin or SuperAdmin role.
      - The request parameter should include the user ID, and all orders related to that user will be removed.`,
  })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user whose orders are to be deleted',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete('remove/:userId')
  async deleteOrdersFromUser(@Param('userId') userId: string) {
    return await this.ordersService.deleteOrdersFromUser(userId);
  }

}
