import { ApiProperty } from "@nestjs/swagger";
import { Category } from "src/modules/categories/entities/category.entity";
import { Product } from "src/modules/products/entities/product.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";

@Entity({ name: 'OFFERS' })
export class Offer {

    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({ 
        description: 'ID único de la oferta', 
        example: 'c8a3b5e4-9b2c-4ef9-a5c1-5f14d99e1c9e'
    })
    offerId?: string

    @Column({ type: 'numeric', nullable: false })
    @ApiProperty({ 
        description: 'Porcentaje de descuento', 
        example: 20
    })
    percentage: number

    @Column({ type: 'date', nullable: true })
    @ApiProperty({ 
        description: 'Fecha de expiración de la oferta', 
        example: '2024-12-31' 
    })
    dueDate: Date

    @OneToOne(() => Product, (product) => product.offers)
    @ApiProperty({ type: () => Product, 
        description: 'Producto asociado a la oferta' 
    })
    product: Product;

    @OneToOne(() => Category, (category) => category.offer)
    @ApiProperty({ type: () => Category, 
        description: 'Categoría asociada a la oferta' 
    })
    category: Category;
}
