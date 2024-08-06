import { Injectable } from '@nestjs/common';
import { CartItem } from '../cart/entities/cart.item.entity';
import { User } from '../users/entities/user.entity';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository) { }

  async createOrderFromCart(cartItems: CartItem[], userId: string) {
    return await this.ordersRepository.createOrderFromCart(cartItems, userId);
  }
}