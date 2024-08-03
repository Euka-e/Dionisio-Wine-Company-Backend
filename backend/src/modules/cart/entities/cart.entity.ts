import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CartDetail } from './cartdetail.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'CARTS' })
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'The unique identifier of the cart',
    example: 'z9y8x7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4'
  })
  cartId?: string;

  /* @Column()
  @ApiProperty({
    description: 'The date when the cart was placed',
    example: '2024-07-24T14:48:00.000Z'
  })
  date: Date; */

  @OneToOne(() => User, user => user.cart)
  @JoinColumn({ name: "user_id" })
  @ApiProperty({ description: 'The user who owns this cart' })
  user: User;

  @OneToOne(() => CartDetail, (cartDetail) => cartDetail.cart)
  @JoinColumn({ name: 'cartdetail_id' })
  @ApiProperty({
    description: 'The details of the cart',
    type: () => CartDetail
  })
  cartDetail: CartDetail;
}

