import { Repository } from "typeorm";
import { Product } from "../products/entities/product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Cart } from "./entities/cart.entity";
import { CartDetail } from "./entities/cartdetail.entity";
import { User } from "../users/entities/user.entity";

@Injectable()
export class CartRepository {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartDetail) private cartDetailRepository: Repository<CartDetail>,
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(User) private userRepository: Repository<User>,

  ) { }

  async create(id: string, products: { productId: string, quantity: number }[]): Promise<Cart> {
    let total = 0;

    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User with id: ${id} not found`);

    let cart = await this.cartRepository.findOne({
      where: { user: { id } },
      relations: { cartDetail: true },
    });

    if (!cart) {
      cart = new Cart();
      cart.user = user;
      cart = await this.cartRepository.save(cart);
    }

    const productArray = await Promise.all(
      products.map(async ({ productId, quantity }) => {
        const product = await this.productsRepository.findOneBy({ productId });
        if (!product) throw new NotFoundException(`Product with Id ${productId} not found`);

        if (product.stock < quantity) {
          throw new BadRequestException(`Insufficient stock for product with Id ${productId}`);
        }

        total += Number(product.price) * quantity;

        await this.productsRepository.update(
          { productId },
          { stock: product.stock - quantity },
        );

        return { ...product, quantity };
      }),
    );

    const existingCartDetail = await this.cartDetailRepository.findOne({
      where: { cart: { cartId: cart.cartId } },
    });

    if (existingCartDetail) {
      existingCartDetail.price = Number(total.toFixed(2));
      existingCartDetail.products = productArray;
      await this.cartDetailRepository.save(existingCartDetail);
    } else {
      const cartDetail = new CartDetail();
      cartDetail.price = Number(total.toFixed(2));
      cartDetail.products = productArray;
      cartDetail.cart = cart;
      await this.cartDetailRepository.save(cartDetail);
    }

    return await this.cartRepository.findOne({
      where: { cartId: cart.cartId },
      relations: { cartDetail: true },
    });
  }
  /* async checkout(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['cart', 'cart.items', 'cart.items.product'],
    });

    if (!user || !user.cart) {
      throw new Error('Cart not found');
    }

    const cart = user.cart;

    const products = cart.items.map((item) => ({
      id: item.productId,
      quantity: item.quantity,
    }));

    await this.orderRepository.create(userId, products);

    cart.cartDetails = CartDetails[];
    cart.total = 0;
    await this.cartRepository.save(cart);
  } */

}
