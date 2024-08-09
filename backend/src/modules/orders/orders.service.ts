import { Injectable } from '@nestjs/common';
import { CartItem } from '../cart/entities/cart.item.entity';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) { }

  async getOrders() {
    return await this.ordersRepository.getOrders();
  }

  async createOrderFromCart(cartItems: CartItem[], userId: string) {
    return await this.ordersRepository.createOrderFromCart(cartItems, userId);
  }
}
