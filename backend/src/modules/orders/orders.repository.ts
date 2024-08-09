import { UsersRepository } from 'src/modules/users/users.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/orderdetail.entity';
import { CartItem } from '../cart/entities/cart.item.entity';
import { Repository, QueryRunner, getConnection } from 'typeorm';
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
    const orders = await this.orderRepository.find({ relations: ['user', 'details'] });
    return orders;
  }

  async createOrderFromCart(cartItems: CartItem[], userId: string) {
    const findUser = await this.usersRepository.getUserById(userId);
    if (!findUser) {
      throw new NotFoundException('User not found');
    }

    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = new Order();
      order.user = findUser;
      order.status = OrderStatus.PENDING;

      const savedOrder = await queryRunner.manager.save(order);

      const orderDetails = cartItems.map(item => {
        const orderDetail = new OrderDetail();
        orderDetail.order = savedOrder;
        orderDetail.product = item.product;
        orderDetail.quantity = Number(item.quantity);
        orderDetail.price = item.price;
        orderDetail.total = orderDetail.quantity * orderDetail.price;
        return orderDetail;
      });

      await queryRunner.manager.save(orderDetails);
      await queryRunner.commitTransaction();

      return savedOrder;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
