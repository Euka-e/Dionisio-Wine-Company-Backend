import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { Product } from "../../products/entities/product.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Order } from "./order.entity";

@Entity({ name: 'ORDERDETAILS' })
export class OrderDetail {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({
        description: 'The unique identifier for the order detail',
        example: 'z9y8x7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4'
      })
    orderDetailId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({
    description: 'The price of the order detail',
    example: 99.99,
  })
  price: number;

    @OneToOne(() => Order, (order) => order.orderDetail)
    @ApiProperty({
        description: 'The order associated with these details',
        type: () => Order
      })
    order: Order;

    @ManyToMany(() => Product)
    @JoinTable({
        name: 'ORDER_DETAIL_PRODUCTS',
        joinColumn: {
            name: 'orderdetail_id',
            referencedColumnName: 'orderDetailId'
        },
        inverseJoinColumn: {
            name: 'product_id',
            referencedColumnName: 'productId'
        }
    })
    @ApiProperty({
        description: 'The list of products in the order detail',
        type: () => [Product]
      })
    products: Product[];
}

