import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/modules/products/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from './cart.entity';

@Entity({ name: 'CART_ITEMS' })
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'The unique identifier of the cart item' })
  id: string;

  @ManyToOne(() => Cart, cart => cart.items)
  @ApiProperty({ description: 'The cart to which this item belongs' })
  cart: Cart;

  @ManyToOne(() => Product)
  @ApiProperty({ description: 'The product associated with this cart item' })
  product: Product;

  @Column('int')
  @ApiProperty({ description: 'The quantity of the product in the cart' })
  quantity: number;

  @Column('decimal')
  @ApiProperty({ description: 'The price of the product in the cart' })
  price: number;
}
