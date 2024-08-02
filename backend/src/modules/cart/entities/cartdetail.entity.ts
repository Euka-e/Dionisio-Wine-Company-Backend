import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from 'src/modules/products/entities/product.entity';

@Entity({ name: 'CART_ITEMS' })
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'The unique identifier of the cart item' })
  cartItemId: string;

  @ManyToOne(() => Cart, (cart) => cart.items)
  @ApiProperty({ description: 'The cart to which this item belongs' })
  cart: Cart;

  @OneToOne(() => Product, (product)=>product.cartItem)
  @JoinColumn({ name: 'productId' })
  @ApiProperty({ description: 'ID of the product associated with this cart item' })
  product: Product;

  @Column('int')
  @ApiProperty({ description: 'The quantity of the product in the cart' })
  quantity: number;

  @Column('decimal')
  @ApiProperty({ description: 'The price of the product in the cart' })
  price: number;
}
