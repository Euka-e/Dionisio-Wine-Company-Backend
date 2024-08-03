import { User } from 'src/modules/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { OrderDetail } from './orderDetail.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'ORDERS' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'The unique identifier for the order',
    example: 'a3bb2a61-4e60-4fd7-904e-77b96f4f72f1',
  })
  id: string;

  @Column()
  @ApiProperty({
    description: 'The date when the order was placed',
    example: '2024-07-24T14:48:00.000Z',
  })
  date: Date;

  @OneToOne(() => OrderDetail, (orderDetail) => orderDetail.order)
  @JoinColumn({ name: 'orderdetail_id' })
  @ApiProperty({
    description: 'The details of the order',
    type: () => OrderDetail,
  })
  orderDetail: OrderDetail;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({
    description: 'The user who placed the order',
    type: () => User,
  })
  user: User;
}
