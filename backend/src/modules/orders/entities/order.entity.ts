import { User } from "src/modules/users/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToOne, JoinColumn } from "typeorm";
import { OrderDetail } from "./orderDetail.entity";

@Entity({ name: 'ORDERS' })
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    date: Date;

    @OneToOne(() => OrderDetail, (orderDetail) => orderDetail.order)
    @JoinColumn({ name: 'orderdetail_id' })
    orderDetail: OrderDetail;

    @ManyToOne(() => User, (user) => user.orders)
    @JoinColumn({ name: 'user_id' })
    user: User;
}