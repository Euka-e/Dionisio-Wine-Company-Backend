import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CartDetail } from './cartdetail.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'CARTS' })
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'The unique identifier of the cart' })
  cartId?: string;

  @OneToOne(() => User, user => user.cart)
  @JoinColumn({ name : "user_id"})
  @ApiProperty({ description: 'The user who owns this cart' })
  user: User;

  @OneToMany(() => CartDetail, CartDetail => CartDetail.cart, { cascade: true })
  @ApiProperty({ description: 'The items in the cart' })
  cartDetail?: CartDetail[];

  @Column('decimal', { default: 0 })
  @ApiProperty({ description: 'The total price of all items in the cart' })
  total?: number;

  
}

