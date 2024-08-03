import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete /* UseGuards */,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/authorization.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../users/dto/roles.enum';
import { UpdateOrderDto } from './dto/update-order.dto';
/* import { AuthorizationGuard } from '../auth/guards/authorization.guard' */

@Controller('orders')
@ApiTags('Orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  //! Verificar logica del Carrito de compra antes de poner una guarda a este POST
  @Post()
  create(@Body() order: CreateOrderDto) {
    const {id, products} = order;
    return this.ordersService.create(id,products);
}
  /*   @Get()
  //@UseGuards(AuthorizationGuard)
  findAll() {
    return this.ordersService.findAll();
  } */

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
}
