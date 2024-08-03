import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderDetail } from './entities/orderDetail.entity';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private ordersDetailRepository: Repository<OrderDetail>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Product) private productsRepository: Repository<Product>,
  ) {}

  async create(
    userId: string,
    products: { id: string; quantity: number }[],
  ): Promise<Order> {
    let total = 0;

    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException(`User with Id ${userId} not found`);

    const newOrder = new Order();
    newOrder.date = new Date();
    newOrder.user = user;
    const savedOrder = await this.ordersRepository.save(newOrder);

    const productArray = await Promise.all(
      products.map(async ({ id, quantity }) => {
        const product = await this.productsRepository.findOneBy({ id });
        if (!product)
          throw new NotFoundException(`Product with Id ${id} not found`);

        total += Number(product.price) * quantity;

        await this.productsRepository.update(
          { id },
          { stock: product.stock - quantity },
        );

        return { ...product, quantity };
      }),
    );

    const orderDetail = new OrderDetail();
    orderDetail.price = Number(total.toFixed(2));
    orderDetail.products = productArray;
    orderDetail.order = savedOrder;

    await this.ordersDetailRepository.save(orderDetail);

    return await this.ordersRepository.findOne({
      where: { id: savedOrder.id },
      relations: { orderDetail: true },
    });
  }

  findOne(id: string) {
    const order = this.ordersRepository.findOne({
      where: { id },
      relations: { orderDetail: { products: true } },
    });

    if (!order) {
      throw new NotFoundException(`Order with Id ${id} not found`);
    }

    return order;
  }
}
