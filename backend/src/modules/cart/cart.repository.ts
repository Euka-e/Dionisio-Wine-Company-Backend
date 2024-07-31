import { Repository } from "typeorm";
import { Product } from "../products/entities/product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Cart } from "./entities/cart.entity";
import { CartItem } from "./entities/cartItem.entity";
import { Order } from "../orders/entities/order.entity";

@Injectable()
export class CartRepository {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product) private productRepository: Repository<Product>
  ) {}

  async createCart(userId: string): Promise<Cart> {
    const cart = this.cartRepository.create({ user: { id: userId }, total: 0 });
    return await this.cartRepository.save(cart);
  }

  async addItemToCart(cartId: string, productId: string, quantity: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({ where: { id: cartId }, relations: ['items', 'items.product'] });
    const product = await this.productRepository.findOne({ where: { id: productId } });

    let cartItem = cart.items.find(item => item.product.id === productId);
    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.price = cartItem.quantity * product.price;
    } else {
      cartItem = this.cartItemRepository.create({ cart, product, quantity, price: product.price * quantity });
      cart.items.push(cartItem);
    }

    cart.total = cart.items.reduce((acc, item) => acc + item.price, 0);
    await this.cartItemRepository.save(cartItem);
    return await this.cartRepository.save(cart);
  }

/*   async checkoutCart(cartId: string): Promise<Order> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['items', 'items.product', 'user'],
    });

    const order = await this.orderService.create(cart);

    cart.items = [];
    cart.total = 0;
    await this.cartRepository.save(cart);

    return order;
  } */

  // removeItem
}