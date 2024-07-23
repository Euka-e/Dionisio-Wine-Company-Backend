import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToMany, JoinTable } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "../../products/entities/product.entity";

@Entity({ name: 'ORDERDETAILS' })
export class OrderDetail {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @OneToOne(() => Order, (order) => order.orderDetail)
    order: Order;

    @ManyToMany(() => Product)
    @JoinTable({
        name: 'ORDER_DETAIL_PRODUCTS',
        joinColumn: {
            name: 'orderdetail_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'product_id',
            referencedColumnName: 'id'
        }
    })
    products: Product[];
}