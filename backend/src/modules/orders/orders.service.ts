import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) { }

  async getOrders() {
    return await this.ordersRepository.getOrders();
  }

  async getOrdersByUserId(userId: string) {
    return await this.ordersRepository.getOrdersByUserId(userId);
  }

  async createOrderFromCart(cartItems: CreateOrderDto, userId: string) {
    return await this.ordersRepository.createOrderFromCart(cartItems, userId);
  }

  async updateOrderStatus(order: UpdateOrderDto) {
    return await this.ordersRepository.updateOrderStatus(order);
  }

  async deleteOrdersFromUser(userId: string) {
    return await this.ordersRepository.deleteOrdersFromUser(userId);
  }

}
