import { ApiProperty } from "@nestjs/swagger";
import { Product } from "src/modules/products/entities/product.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { CartDetail } from "./cartdetail.entity";

@Entity({ name: 'CART_ITEM' })
export class CartItem {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({
        description: 'The unique identifier of the cart item',
        example: 'a9b8c7d6-e5f4-g3h2-i1j0-k9l8m7n6o5p4'
    })
    cartItemId: string;

    @ManyToOne(() => CartDetail, (cartDetail) => cartDetail.items, { onDelete: 'CASCADE' })
    @ApiProperty({
        description: 'The cart detail associated with this item',
        type: () => CartDetail
    })
    cartDetail: CartDetail;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    @ApiProperty({
        description: 'The product in the cart item',
        type: () => Product
    })
    product: Product;

    @Column('int')
    @ApiProperty({ description: 'The quantity of the product in the cart item' })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    @ApiProperty({ description: 'The price of the product in the cart item' })
    price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    @ApiProperty({ description: 'The total price for this product in the cart item' })
    total: number;
}