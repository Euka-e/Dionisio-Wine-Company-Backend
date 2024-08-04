import { Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) { }

  async findAll(): Promise<Cart[]> {
    return await this.cartRepository.findAll();
  }
  
  async findOne(id: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne(id);
    if (!cart) throw new NotFoundException(`Cart with id: ${id} not found`);
    return cart;
  }

  async create(id: string, products: { productId: string, quantity: number }[]) {
    return await this.cartRepository.create(id, products);
  }

  async delete(id:string){
    return await this.cartRepository.removeCart(id);
  }

  async checkout(id: string) {
    /* return await this.cartRepository.checkout(id); */
  }
}
