import { Controller, Get, Post, Body, Patch, Param, Delete, /* UseGuards */ } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags } from '@nestjs/swagger';
/* import { AuthorizationGuard } from '../auth/guards/authorization.guard' */

@Controller('orders')
@ApiTags('Orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  create(@Body() order: CreateOrderDto) {
    const {userId, products} = order;
    return this.ordersService.create(userId,products);
}

/*   @Get()
  //@UseGuards(AuthorizationGuard)
  findAll() {
    return this.ordersService.findAll();
  } */

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

/*   @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  } */
}
