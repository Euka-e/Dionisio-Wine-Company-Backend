import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) { }

  async getOrders() {
    return await this.ordersRepository.getOrders();
  }

  async createOrderFromCart(cartItems: CreateOrderDto, userId: string) {
    return await this.ordersRepository.createOrderFromCart(cartItems, userId);
  }
}
