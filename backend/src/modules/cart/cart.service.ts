import { Injectable } from '@nestjs/common';
import { CartRepository } from './cart.repository';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) { }
  /* 
    async createCart(id: string) {
      return await this.cartRepository.createCart(id);
    } */

  //productId
  create(id: string, products: { productId: string, quantity: number }[]) {
    return this.cartRepository.create(id, products);
  }

  async checkout(id: string) {
    /* return await this.cartRepository.checkout(id); */
  }
}
