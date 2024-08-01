import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CartItem } from './cartItem.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'CARTS' })
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'The unique identifier of the cart' })
  id: string;

  @OneToOne(() => User, user => user.cart)
  @ApiProperty({ description: 'The user who owns this cart' })
  user: User;

  @OneToMany(() => CartItem, cartItem => cartItem.cart, { cascade: true })
  @ApiProperty({ description: 'The items in the cart' })
  items: CartItem[];

  @Column('decimal', { default: 0 })
  @ApiProperty({ description: 'The total price of all items in the cart' })
  total: number;
}

