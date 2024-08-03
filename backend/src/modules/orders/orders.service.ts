import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(private ordersRepository:OrdersRepository) {}

  create(id:string, products:any) {
      return this.ordersRepository.create(id, products);
  }

  findOne(id:string) {
      return this.ordersRepository.findOne(id)
  }
}