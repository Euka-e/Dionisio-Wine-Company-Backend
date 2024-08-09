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
        }
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

  async create(id: string, products: { productId: string, quantity: number }[]): Promise<Cart> {
    let total = 0;

    // Verificar si el usuario existe
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User with id: ${id} not found`);

    // Obtener o crear el carrito para el usuario
    let cart = await this.cartRepository.findOne({
      where: { user: { id } },
      relations: { cartDetail: { items: true } },
    });

    if (!cart) {
      cart = new Cart();
      cart.user = user;
      cart = await this.cartRepository.save(cart);
    }

    // Obtener el detalle del carrito existente
    const existingCartDetail = await this.cartDetailRepository.findOne({
      where: { cart: { cartId: cart.cartId } },
      relations: { items: { product: true } },
    });

    // Crear un mapa para los ítems existentes en el carrito
    const existingItemsMap = new Map<string, CartItem>();
    if (existingCartDetail) {
      existingCartDetail.items.forEach(item => {
        existingItemsMap.set(item.product.productId, item);
      });
    }

    // Procesar los productos y calcular el total
    const updatedCartItems = await Promise.all(
      products.map(async ({ productId, quantity }) => {
        if (quantity == null || quantity <= 0) {
          throw new BadRequestException('Quantity must be a positive number');
        }

        // Verificar si el producto existe
        const product = await this.productsRepository.findOneBy({ productId });
        if (!product) throw new NotFoundException(`Product with Id ${productId} not found`);

        // Verificar si hay suficiente stock
        if (product.stock < quantity) {
          throw new BadRequestException(`Insufficient stock for product with Id ${productId}`);
        }

        const itemTotal = Number(product.price) * quantity;
        total += itemTotal;

        // Actualizar el stock del producto
        await this.productsRepository.update(
          { productId },
          { stock: product.stock - quantity },
        );

        // Crear o actualizar el ítem del carrito
        let cartItem = existingItemsMap.get(productId);
        if (cartItem) {
          // Actualizar la cantidad y el total del ítem existente
          cartItem.quantity += quantity;
          cartItem.total = cartItem.quantity * cartItem.price;
        } else {
          // Crear nuevo ítem del carrito
          cartItem = new CartItem();
          cartItem.product = product;
          cartItem.quantity = quantity;
          cartItem.price = product.price;
          cartItem.total = itemTotal;
        }
        return cartItem;
      }),
    );

    if (updatedCartItems.length === 0) {
      throw new BadRequestException('No valid products to add to cart');
    }

    // Si el carrito tiene detalles existentes, actualizarlos
    if (existingCartDetail) {
      // Mantener los ítems existentes y actualizar los nuevos ítems
      const allItems = new Map<string, CartItem>(existingItemsMap);
      updatedCartItems.forEach(item => {
        allItems.set(item.product.productId, item);
      });
      existingCartDetail.items = Array.from(allItems.values());
      existingCartDetail.total = Number(total.toFixed(2));
      await this.cartDetailRepository.save(existingCartDetail);
    } else {
      // Crear nuevo detalle del carrito
      const cartDetail = new CartDetail();
      cartDetail.items = updatedCartItems;
      cartDetail.cart = cart;
      cartDetail.total = Number(total.toFixed(2));
      await this.cartDetailRepository.save(cartDetail);
    }

    // Recuperar y devolver el carrito actualizado
    return await this.cartRepository.findOne({
      where: { cartId: cart.cartId },
      relations: { cartDetail: { items: { product: true } } },
    });
  }

  async clearCart(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['cart'],
    });

    if (!user || !user.cart) {
      throw new NotFoundException(`Cart for user with id: ${userId} not found`);
    }

    try {
      await this.cartDetailRepository.delete({ cart: { cartId: user.cart.cartId } });

      await this.cartRepository.remove(user.cart);
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting cart and details: ${error.message}`);
    }
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
