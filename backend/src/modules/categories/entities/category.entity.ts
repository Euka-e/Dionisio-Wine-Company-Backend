import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
//import { Offer } from 'src/modules/offers/entities/offer.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'CATEGORIES' })
export class Category {
    @ApiProperty({
        description: 'Identificador único de la categoría',
        example: 'c1e70b6b-6f3b-4bde-9c13-71a23f78c0e7',
      })
      @PrimaryGeneratedColumn('uuid')
      categoryId: string;
    
      @ApiProperty({
        description: 'Nombre de la categoría',
        example: 'Vinos Tintos',
      })
      @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
      name: string;
    
      @ApiProperty({
        description: 'Lista de productos asociados a la categoría',
        type: () => [Product],
      })
      @OneToMany(() => Product, (product) => product.category)
      products: Product[];

/*     @OneToOne(() => Offer, (offer) => offer.category)
    @ApiProperty({ type: () => Offer, description: 'Oferta asociada a la categoría' })
    offer?: Offer; */
}