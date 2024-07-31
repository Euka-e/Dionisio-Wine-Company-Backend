import { Injectable } from '@nestjs/common';
import { CartRepository } from './cart.repository';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) { }

  async createCart(userId: string) {
    return await this.cartRepository.createCart(userId);
  }

  async addItemToCart(cartId: string, productId: string, quantity: number) {
    return await this.cartRepository.addItemToCart(cartId, productId, quantity);
  }
}
