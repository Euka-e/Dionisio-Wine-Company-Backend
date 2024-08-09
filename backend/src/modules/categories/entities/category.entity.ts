import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Offer } from 'src/modules/offers/entities/offer.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'CATEGORIES' })
export class Category {
    @PrimaryGeneratedColumn('uuid')
    categoryId: string;

    @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
    name: string;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];

    @OneToOne(() => Offer, (offer) => offer.category)
    @ApiProperty({ type: () => Offer, description: 'Oferta asociada a la categoría' })
    offer?: Offer;
}