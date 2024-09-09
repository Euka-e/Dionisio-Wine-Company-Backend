import { Repository } from "typeorm";
import { Product } from "../products/entities/product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Cart } from "./entities/cart.entity";
import { CartDetail } from "./entities/cartdetail.entity";
import { User } from "../users/entities/user.entity";
import { CartItem } from "./entities/cart.item.entity";

@Injectable()
export class CartRepository {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartDetail) private cartDetailRepository: Repository<CartDetail>,
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(User) private userRepository: Repository<User>,

  ) { }

  async findAll(): Promise<Cart[]> {
    return await this.cartRepository.find({
      relations: {
        cartDetail: {
          items: {
            product: true
          }
        },
        user: true
      }
    });
  }
  async findOne(id: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { cartId: id },
      relations: { cartDetail: true },
    });
    if (!cart) throw new NotFoundException(`Cart with id: ${id} not found`);
    return cart;
  }

  async updateCart(userId: string, products: { productId: string, quantity: number }[]) {
    let total = 0;

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException(`User with id: ${userId} not found`);

    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: { cartDetail: { items: true } },
    });

    if (!cart) {
      cart = new Cart();
      cart.user = user;
      cart = await this.cartRepository.save(cart);
    }

    const existingCartDetail = await this.cartDetailRepository.findOne({
      where: { cart: { cartId: cart.cartId } },
      relations: { items: { product: true } },
    });

    const existingItemsMap = new Map<string, CartItem>();
    if (existingCartDetail) {
      existingCartDetail.items.forEach(item => {
        existingItemsMap.set(item.product.productId, item);
      });
    }

    const updatedCartItems = await Promise.all(
      products.map(async ({ productId, quantity }) => {
        if (quantity == null) {
          throw new BadRequestException('Quantity must be provided');
        }

        const product = await this.productsRepository.findOneBy({ productId });
        if (!product) throw new NotFoundException(`Product with Id ${productId} not found`);

        if (quantity > 0) {
          if (product.stock < quantity) {
            throw new BadRequestException(`Insufficient stock for product with Id ${productId}`);
          }

          const itemTotal = Number(product.price) * quantity;
          total += itemTotal;

          let cartItem = existingItemsMap.get(productId);
          if (cartItem) {
            cartItem.quantity += quantity;
            cartItem.total = cartItem.quantity * cartItem.price;
          } else {
            cartItem = new CartItem();
            cartItem.product = product;
            cartItem.quantity = quantity;
            cartItem.price = product.price;
            cartItem.total = itemTotal;
          }
          return cartItem;
        } else if (quantity === 0) {
          let cartItem = existingItemsMap.get(productId);
          if (cartItem) {
            existingItemsMap.delete(productId);
          }
          return null;
        }
      }),
    );

    if (updatedCartItems.length === 0) {
      throw new BadRequestException('No valid products to update in cart');
    }

    if (existingCartDetail) {
      const allItems = new Map<string, CartItem>(existingItemsMap);
      updatedCartItems.filter(item => item !== null).forEach(item => {
        allItems.set(item.product.productId, item);
      });
      existingCartDetail.items = Array.from(allItems.values());
      existingCartDetail.total = Number(total.toFixed(2));
      await this.cartDetailRepository.save(existingCartDetail);
    } else {
      const cartDetail = new CartDetail();
      cartDetail.items = updatedCartItems.filter(item => item !== null);
      cartDetail.cart = cart;
      cartDetail.total = Number(total.toFixed(2));
      await this.cartDetailRepository.save(cartDetail);
    }

    return await this.cartRepository.findOne({
      where: { cartId: cart.cartId },
      relations: { cartDetail: { items: { product: true } } },
    });
  }

  async clearCart(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['cart'],
    });
    if (!user.cart) {
      throw new NotFoundException(`Cart for user with id: ${userId} not found`);
    }
    try {
      const cartDetail = await this.cartDetailRepository.findOne({
        where: { cart: { cartId: user.cart.cartId } },
        relations: { items: { product: true } },
      });

      if (cartDetail) {
        for (const item of cartDetail.items) {
          await this.productsRepository.update(
            { productId: item.product.productId },
            { stock: item.product.stock + item.quantity }
          );
        }
      }
      await this.cartRepository.remove(user.cart);
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting cart and details: ${error.message}`);
    }
  }
}