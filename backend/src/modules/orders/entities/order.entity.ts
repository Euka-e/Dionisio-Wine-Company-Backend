import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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
