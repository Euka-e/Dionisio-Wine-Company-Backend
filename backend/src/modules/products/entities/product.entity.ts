import { Category } from '../../categories/entities/category.entity';
import { OrderDetail } from '../../orders/entities/orderdetail.entity';
//import { Offer } from '../../offers/entities/offer.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CartDetail } from 'src/modules/cart/entities/cartdetail.entity';

@Entity({ name: 'PRODUCTS' })
export class Product {
  @ApiProperty({
    description: 'Unique identifier for the product',
    example: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  productId?: string;

  @ApiProperty({
    description: 'Name of the product',
    example: 'Red Wine',
  })
  @Column({ length: 50, nullable: false, unique: true })
  name: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'A fine red wine with notes of cherry and oak.',
  })
  @Column({ type: 'text', nullable: false })
  description: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 19.99,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @ApiProperty({
    description: 'Stock quantity of the product',
    example: 100,
  })
  @Column({ type: 'int', nullable: false })
  stock: number;

  @ApiProperty({
    description: 'Image URL of the product',
    example: 'https://example.com/images/red-wine.jpg',
  })
  @Column({ type: 'text', default: 'default-image.jpg', nullable: false })
  imgUrl: string;

  @ApiProperty({
    description: 'Type of the product (Cepa)',
    example: 'wine',
  })

  //! ACA FALTA CEPA, agregar?
  @ApiProperty({
    description: 'Store where the product is available (Bodega)',
    example: 'Main Store',
  })

  //! ESTO ES BODEGA
  @Column({ type: 'text', nullable: false })
  store: string;

  @Column('boolean', { default: true })
  isActive?: boolean;

/*   @ApiProperty({
    description: 'Offer associated with the product',
    type: () => Offer,
  })
  @OneToOne(() => Offer, (offer) => offer.product)
  offers?: Offer; */

  @ApiProperty({
    description: 'Category of the product',
    type: () => Category,
  })
  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @ApiProperty({
    description: 'Order details associated with the product',
    type: () => [OrderDetail],
  })
  @ManyToMany(() => OrderDetail, (orderDetail) => orderDetail.product)
  orderDetail?: OrderDetail[];

  @ManyToMany(() => CartDetail, (cartDetail) => cartDetail.items)
  cartDetail?: CartDetail[];
}
