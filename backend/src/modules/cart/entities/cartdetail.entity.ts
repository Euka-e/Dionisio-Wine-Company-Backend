import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { CartItem } from './cart.item.entity';

@Entity({ name: 'CART_DETAIL' })
export class CartDetail {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'The unique identifier of the cart detail',
    example: 'z9y8x7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4'
  })
  cartDetailId: string;

  @OneToOne(() => Cart, (cart) => cart.cartDetail, { onDelete: 'CASCADE' })
  @ApiProperty({
    description: 'The cart associated with these details',
    type: () => Cart
  })
  cart: Cart;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cartDetail, { cascade: true })
  @ApiProperty({
    description: 'The list of cart items in the cart detail',
    type: () => [CartItem]
  })
  items: CartItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty({ description: 'The total price of the cart detail' })
  total: number;
}