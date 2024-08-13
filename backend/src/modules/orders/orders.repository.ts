import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/orderdetail.entity';
import { UsersRepository } from '../users/users.repository';
import { OrderStatus } from './entities/order.status.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product } from '../products/entities/product.entity';
import { Repository, DataSource } from 'typeorm';
import { UpdateOrderDto } from './dto/update-order.dto';
import { MailingService } from '../mailing/mailing.service';

@Injectable()
export class OrdersRepository {
  constructor(
    @Inject(DataSource) private readonly dataSource: DataSource,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    private readonly usersRepository: UsersRepository,
    private readonly mailingService: MailingService,
  ) {}

  async getOrders() {
    const orders = await this.orderRepository.find({
      relations: ['user', 'details'],
    });
    return orders;
  }

  async getOrdersByUserId(userId: string) {
    const orders = await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'details', 'details.product'],
    });
    const sanitizedOrders = orders.map((order) => {
      const sanitizedUser = { ...order.user }; //? Aquí vamos a poner los campos del usuario que no queremos obtener
      delete sanitizedUser.password;
      delete sanitizedUser.role;
      delete sanitizedUser.authId;
      delete sanitizedUser.id;
      delete sanitizedUser.country;
      delete sanitizedUser.address;
      delete sanitizedUser.city;
      delete sanitizedUser.date;
      delete sanitizedUser.phone;
      return { ...order, user: sanitizedUser };
    });
    return sanitizedOrders;
  }

  async createOrderFromCart(cartItems: CreateOrderDto, userId: string) {
    try {
      const findUser = await this.usersRepository.getUserById(userId);
      const { email } = findUser;

      if (!findUser) {
        throw new Error('User not found');
      }
      const order = new Order();
      order.user = findUser;
      order.status = OrderStatus.PENDING;
      order.price = cartItems.price;
      const savedOrder = await this.orderRepository.save(order);
      const orderDetails = await Promise.all(
        cartItems.cartItems.map(async (item) => {
          const orderDetail = new OrderDetail();
          orderDetail.order = savedOrder;
          const findProduct = await this.productRepository.findOneBy({
            productId: item.productId,
          });
          orderDetail.product = findProduct;
          orderDetail.quantity = item.quantity;
          orderDetail.price = item.price;
          orderDetail.total = item.quantity * item.price;

          try {
            await this.mailingService.sendPurchaseConfirmationEmail(email);
            console.log('Correo de bienvenida enviado correctamente');
          } catch (mailError) {
            console.error('Error al enviar el correo:', mailError.message);
          }

          return orderDetail;
        }),
      );
      await this.orderDetailRepository.save(orderDetails);
      /* await this.cartRepository.clearCart(userId); */
      return savedOrder;
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException('Error creating order');
    }
  }

  async updateOrderStatus(order: UpdateOrderDto) {
    return await this.orderRepository.update(
      { id: order.orderId },
      { status: order.status },
    );
  }

  async deleteOrdersFromUser(userId: string) {
    return await this.orderRepository.delete({ user: { id: userId } });
  }
}
