import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity({ name: 'ORDER_DETAIL' })
export class OrderDetail {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'The unique identifier of the order detail',
    example: 'a9b8c7d6-e5f4-g3h2-i1j0-k9l8m7n6o5p4'
  })
  orderDetailId: string;

  @ManyToOne(() => Order, (order) => order.details, { onDelete: 'CASCADE' })
  @ApiProperty({
    description: 'The order associated with these details',
    type: () => Order
  })
  order: Order;

  @ManyToOne(() => Product)
  @ApiProperty({
    description: 'The product in the order detail',
    type: () => Product
  })
  product: Product;

  @Column('int')
  @ApiProperty({ description: 'The quantity of the product in the order detail' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ description: 'The price of the product in the order detail' })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty({ description: 'The total price for this product in the order detail' })
  total: number;
}
