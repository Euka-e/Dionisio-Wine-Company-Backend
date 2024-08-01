import { Repository } from "typeorm";
import { Product } from "../products/entities/product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Cart } from "./entities/cart.entity";
import { CartItem } from "./entities/cartItem.entity";
import { order } from "../orders/entities/order.entity";
import { OrdersRepository } from "../orders/orders.repository";
import { UsersRepository } from "../users/users.repository";
import { User } from "../users/entities/user.entity";

@Injectable()
export class CartRepository {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private orderRepository: OrdersRepository,

  ) {}

  async addItemToCart(userId: string, productId: string, quantity: number): Promise<Cart> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['cart', 'cart.items', 'cart.items.product'],
    });

    if (!user || !user.cart) {
      throw new Error('Cart not found');
    }

    const cart = user.cart;
    const product = await this.productRepository.findOne({ where: { id: productId } });

    if (!product) {
      throw new Error('Product not found');
    }

    let cartItem = cart.items.find(item => item.productId === productId);

    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.price = cartItem.quantity * product.price;
    } else {
      cartItem = this.cartItemRepository.create({
        cart,
        product,
        productId,
        quantity,
        price: product.price * quantity,
      });
      cart.items.push(cartItem);
    }

    cart.total = cart.items.reduce((acc, item) => acc + item.price, 0);

    await this.cartItemRepository.save(cartItem);
    return await this.cartRepository.save(cart);
  }

  async checkout(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['cart', 'cart.items', 'cart.items.product'],
    });

    if (!user || !user.cart) {
      throw new Error('Cart not found');
    }

    const cart = user.cart;

    const products = cart.items.map(item => ({
      id: item.productId,
      quantity: item.quantity,
    }));

    await this.orderRepository.create(userId, products);

    cart.items = [];
    cart.total = 0;
    await this.cartRepository.save(cart);
  }

 /*  async checkout(userId: string): Promise<void> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product']
    });

    const products = cart.items.map(item => ({ productId: item.product.id, quantity: item.quantity }));
    await this.orderRepository.create(userId, products);

    cart.items = [];
    cart.total = 0;
    await this.cartRepository.save(cart);
  } */


  // removeItem
}
