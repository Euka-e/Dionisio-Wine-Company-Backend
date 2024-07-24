import { Category } from "src/modules/categories/entities/category.entity";
import { Product } from "src/modules/products/entities/product.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToOne } from "typeorm";

@Entity({ name: 'OFFERS' })
export class Offer {

    @PrimaryGeneratedColumn('uuid')
    offerId?: string

    @Column({ type: 'number', nullable: false })
    percentage: number

    @Column({ type: 'date', nullable: false })
    dueDate: Date

    @OneToOne(() => Product, (product) => product.offer)
    product: Product;

    @OneToOne(() => Category, (category) => category.offer)
    category: Category;
}
