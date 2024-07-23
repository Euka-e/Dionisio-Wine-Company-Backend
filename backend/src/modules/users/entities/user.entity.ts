import { Order } from "src/modules/orders/entities/order.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity({ name: 'USERS' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    name: string;

    @Column({ length: 50, unique: true, nullable: false })
    email: string;

    @Column({ length: 120, nullable: false })
    password: string;

    @Column('int')
    phone: number;

    @Column({ length: 50 })
    country: string;

    @Column('text')
    address: string;

    @Column({ length: 50 })
    city: string;

    @Column()
    date: Date

    @Column({ default: false })
    isAdmin?: boolean;

    @OneToMany(() => Order, order => order.user)
    orders: Order[];
}