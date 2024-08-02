import { AddItemDto } from './dto/addItem.dto';
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
  async addItem(userId: string, products: { id: string, quantity: number }[]) {
    return await this.cartRepository.create(userId, products);
  }

  async checkout(userId: string) {
    /* return await this.cartRepository.checkout(userId); */
  }
}
