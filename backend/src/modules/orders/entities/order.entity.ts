import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderDetail } from './orderdetail.entity';
import { OrderStatus } from './order.status.enum';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity('orders')
export class Order {
  @ApiProperty({
    description: 'UUID of the order',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'User associated with the order',
    type: () => User,
  })
  @ManyToOne(() => User, { eager: true })
  user: User;

  @ApiProperty({
    description: 'Array of order details associated with the order',
    type: () => [OrderDetail],
    example: [
      { id: '123e4567-e89b-12d3-a456-426614174001', product: 'Wine', quantity: 2, price: 19.99 },
    ],
  })
  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order, { cascade: true })
  details: OrderDetail[];

  @ApiProperty({
    description: 'Total price of the order',
    example: 79.97,
  })
  @IsNumber()
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @ApiProperty({
    description: 'Status of the order',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
  })
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @ApiProperty({
    description: 'Tracking number for the order shipment',
    example: 'TRACK123456',
  })
  @Column({ type: 'varchar', nullable: true })
  trackingNumber: string;

  @ApiProperty({
    description: 'URL for tracking the order shipment',
    example: 'https://tracking.example.com/TRACK123456',
  })
  @Column({ type: 'text', nullable: true })
  trackingUrl: string;

  @ApiProperty({
    description: 'Timestamp when the order was created',
    example: '2023-08-15T12:34:56.789Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the order was last updated',
    example: '2023-08-16T12:34:56.789Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}

/* import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderDetail } from './orderdetail.entity';
import { OrderStatus } from './order.status.enum';
import { IsNotEmpty, IsNumber } from 'class-validator';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order, { cascade: true })
  details: OrderDetail[];

  @IsNumber()
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ type: 'varchar', nullable: true })
  trackingNumber: string;

  @Column({ type: 'text', nullable: true })
  trackingUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
 */