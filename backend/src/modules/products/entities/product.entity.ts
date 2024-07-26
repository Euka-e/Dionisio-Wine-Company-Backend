import { Category } from '../../categories/entities/category.entity';
import { OrderDetail } from '../../orders/entities/orderDetail.entity';
import { Offer } from '../../offers/entities/offer.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToOne,
} from 'typeorm';

@Entity({ name: 'PRODUCTS' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ length: 50, nullable: false, unique: true })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'int', nullable: false })
  stock: number;

  @Column({ type: 'text', default: 'default-image.jpg', nullable: false })
  imgUrl: string;

  @Column({ type: 'text', nullable: false })
  store: string; //? Bodega

  @OneToOne(() => Offer, (offer) => offer.product)
  offers: Offer;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category; //? Cepa

  @ManyToMany(() => OrderDetail, (orderDetail) => orderDetail.products)
  orderDetails?: OrderDetail[];
}
