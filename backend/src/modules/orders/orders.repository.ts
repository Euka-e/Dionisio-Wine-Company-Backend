import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/orderdetail.entity';
import { UsersRepository } from '../users/users.repository';
import { OrderStatus } from './entities/order.status.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product } from '../products/entities/product.entity';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class OrdersRepository {
  constructor(
    @Inject(DataSource) private readonly dataSource: DataSource,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly usersRepository: UsersRepository,
  ) { }


  async getOrders() {
    const orders = await this.orderRepository.find({ relations: ['user', 'details'] });
    return orders;
  }

  async getOrdersByUserId(userId: string) {
    const orders = await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'details', 'details.product']
    });
    const sanitizedOrders = orders.map(order => {
      const sanitizedUser = { ...order.user }; //? Aquí vamos a poner los campos del usuario que no queremos obtener
      delete sanitizedUser.password;
      delete sanitizedUser.role;
      delete sanitizedUser.authId;
      delete sanitizedUser.id;
      delete sanitizedUser.country;
      delete sanitizedUser.address;
      delete sanitizedUser.city;
      delete sanitizedUser.date;
      return { ...order, user: sanitizedUser };
    });
    return sanitizedOrders;
  }

  async createOrderFromCart(cartItems: CreateOrderDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const findUser = await this.usersRepository.getUserById(userId);
      if (!findUser) {
        throw new Error('User not found');
      }

      for (const item of cartItems.cartItems) {
        const findProduct = await queryRunner.manager.findOne(Product, { where: { productId: item.productId } });
        if (!findProduct) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }
        if (findProduct.stock < item.quantity) {
          throw new Error(`Insufficient stock for product with ID ${item.productId}`);
        }
      }

      // Crear la orden
      const order = new Order();
      order.user = findUser;
      order.status = OrderStatus.PENDING;
      order.price = cartItems.price;

      const savedOrder = await queryRunner.manager.save(Order, order);

      const orderDetails = await Promise.all(cartItems.cartItems.map(async (item) => {
        const orderDetail = new OrderDetail();
        orderDetail.order = savedOrder;
        const findProduct = await queryRunner.manager.findOne(Product, { where: { productId: item.productId } });
        orderDetail.product = findProduct;
        orderDetail.quantity = item.quantity;
        orderDetail.price = item.price;
        orderDetail.total = item.quantity * item.price;

        await queryRunner.manager.update(Product, { productId: item.productId }, { stock: findProduct.stock - item.quantity });

        return orderDetail;
      }));

      await queryRunner.manager.save(OrderDetail, orderDetails);

      /* await this.cartRepository.clearCart(userId); */ //!Activar esto una vez implementado el carrito en el front

      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error.message);
      throw new BadRequestException('Error creating order');
    } finally {
      await queryRunner.release();
    }
  }

  async deleteOrdersFromUser(userId: string) {
    return await this.orderRepository.delete({ user: { id: userId } });
  }

}

