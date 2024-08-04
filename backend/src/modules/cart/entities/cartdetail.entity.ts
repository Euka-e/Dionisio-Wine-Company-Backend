import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from 'src/modules/products/entities/product.entity';

@Entity({ name: 'CART_DETAIL' })
export class CartDetail {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'The unique identifier of the cart detail',
    example: 'z9y8x7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4'
  })
  cartDetailId: string;

  @OneToOne(() => Cart, (cart) => cart.cartDetail)
  @ApiProperty({
    description: 'The order associated with these details',
    type: () => Cart
  })
  cart: Cart;

  @ManyToMany(() => Product)
  @JoinTable({
    name: 'CART_DETAIL_PRODUCTS',
    joinColumn: {
      name: 'cartdetail_id',
      referencedColumnName: 'cartDetailId'
    },
    inverseJoinColumn: {
      name: 'product_id',
      referencedColumnName: 'productId'
    }
  })
  @ApiProperty({
    description: 'The list of products in the cart detail',
    type: () => [Product]
  })
  products: Product[];

  @Column('int')
  @ApiProperty({ description: 'The quantity of the product in the cart' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ description: 'The price of the product in the cart' })
  price: number;
}
