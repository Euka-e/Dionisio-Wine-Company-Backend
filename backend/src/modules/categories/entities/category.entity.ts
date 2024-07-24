import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Offer } from 'src/modules/offers/entities/offer.entity';

@Entity({ name: 'CATEGORIES' })
export class Category {
    @PrimaryGeneratedColumn('uuid')
    categoryId: string;

    @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
    name: string;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];

    @OneToOne(() => Offer, (offer) => offer.category)
    offer: Offer
}