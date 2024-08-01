import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from "./cartItem.entity";

@Entity({ name: 'CARTS' })
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, user => user.cart)
  user: User;

  @OneToMany(() => CartItem, cartItem => cartItem.cart)
  items: CartItem[];

  @Column('decimal')
  total: number;
}
