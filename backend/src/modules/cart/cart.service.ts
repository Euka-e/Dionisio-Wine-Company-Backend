import { Injectable } from '@nestjs/common';
import { CartRepository } from './cart.repository';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) { }
/* 
  async createCart(userId: string) {
    return await this.cartRepository.createCart(userId);
  } */

    //productId
    async addItemToCart(userId: string, productId: string, quantity: number) {
      return await this.cartRepository.addItemToCart(userId, productId, quantity);
    }
  
    async checkout(userId: string) {
      return await this.cartRepository.checkout(userId);
    }
}
