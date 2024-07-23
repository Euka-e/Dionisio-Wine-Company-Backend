import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity({ name: 'CATEGORIES' })
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
    name: string;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}