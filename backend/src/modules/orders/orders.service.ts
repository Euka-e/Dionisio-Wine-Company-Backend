import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(private ordersRepository:OrdersRepository) {}

  create(userId:string, products:any) {
      return this.ordersRepository.create(userId, products);
  }

  findOne(id:string) {
      return this.ordersRepository.findOne(id)
  }
}