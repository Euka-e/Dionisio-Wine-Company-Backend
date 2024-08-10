import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/orderdetail.entity';
import { UsersRepository } from '../users/users.repository';
import { OrderStatus } from './entities/order.status.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product } from '../products/entities/product.entity';
import { CartRepository } from '../cart/cart.repository';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly usersRepository: UsersRepository,
    private readonly cartRepository: CartRepository,
  ) { }

  async getOrders() {
    const orders = await this.orderRepository.find({ relations: ['user', 'details'] });
    return orders;
  }

  async createOrderFromCart(cartItems: CreateOrderDto, userId: string) {
    try {
      const findUser = await this.usersRepository.getUserById(userId);
      if (!findUser) {
        throw new Error('User not found');
      }

      const order = new Order();
      order.user = findUser;
      order.status = OrderStatus.PENDING;
      order.price = cartItems.price;

      const savedOrder = await this.orderRepository.save(order);

      const orderDetails = await Promise.all(cartItems.cartItems.map(async (item) => {
        const orderDetail = new OrderDetail();
        orderDetail.order = savedOrder;
        const findProduct = await this.productRepository.findOneBy({ productId: item.productId });
        orderDetail.product = findProduct;
        orderDetail.quantity = item.quantity;
        orderDetail.price = item.price;
        orderDetail.total = item.quantity * item.price;
        return orderDetail;
      }));

      await this.orderDetailRepository.save(orderDetails);
      await this.cartRepository.clearCart(userId);

      return savedOrder;
    } catch (error) {
      console.log(error.mesagge)
      throw new BadRequestException('Error creating order');
    }
  }
}

