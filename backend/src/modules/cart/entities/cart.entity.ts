import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CartItem } from './cartItem.entity';

@Entity({ name: 'CARTS' })
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'The unique identifier of the cart' })
  id: string;

  @OneToOne(() => User, user => user.cart)
  @ApiProperty({ description: 'The user to whom this cart belongs' })
  user: User;

  @OneToMany(() => CartItem, cartItem => cartItem.cart)
  @ApiProperty({ description: 'The items in the cart', type: () => [CartItem] })
  items: CartItem[];

  @Column('decimal')
  @ApiProperty({ description: 'The total price of all items in the cart' })
  total: number;
}
