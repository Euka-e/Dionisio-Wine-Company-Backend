import { UsersRepository } from 'src/modules/users/users.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/orderdetail.entity';
import { CartItem } from '../cart/entities/cart.item.entity';
import { Repository } from 'typeorm';
import { OrderStatus } from './entities/order.status.enum';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: UsersRepository,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
  ) { }

  async getOrders() {
    const orders = await this.orderRepository.find({ relations: ['user', 'orderDetails'] });
    return orders;
  }
  async createOrderFromCart(cartItems: CartItem[], userId: string) {
    const findUser = await this.usersRepository.getUserById(userId);
    if (!findUser) {
      throw new Error('User not found');
    }

    const order = new Order();
    order.user = findUser;
    order.status = OrderStatus.PENDING;

    const savedOrder = await this.orderRepository.save(order);

    const orderDetails = cartItems.map(item => {
      const orderDetail = new OrderDetail();
      orderDetail.order = savedOrder;
      orderDetail.product = item.product;
      orderDetail.quantity = item.quantity;
      orderDetail.price = item.price;
      orderDetail.total = item.quantity * item.price;
      return orderDetail;
    });

    await this.orderDetailRepository.save(orderDetails);

    return savedOrder;
  }
}