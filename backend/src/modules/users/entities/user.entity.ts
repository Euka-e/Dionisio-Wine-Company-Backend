import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";
import { Cart } from "src/modules/cart/entities/cart.entity";
import { Order } from "src/modules/orders/entities/order.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { Role } from "../dto/roles.enum";

@Entity({ name: 'USERS' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Unique identifier for the user (UUID)',
    example: 'b0c0c16d-fcb0-4b89-9d1a-6d09ec6b5de5',
  })
  id?: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @ApiProperty({
    description: 'Id de usuario de Google y Auth0',
    minLength: 10,
    maxLength: 255,
    example: 'google-oauth2|1234567890',
  })
  authId?: string;

  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
  })
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @Column({ length: 50, nullable: false })
  email: string;

  @ApiProperty({
    description: 'Password for the user',
    example: 'SecurePassword123',
  })
  @Column({ length: 120, nullable: false })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Country of the user',
    example: 'USA',
  })
  @Column({ length: 50, default: 'Default Country' })
  country: string;

  @ApiProperty({
    description: 'Address of the user',
    example: '123 Main St, Apt 4B',
  })
  @Column({ type: 'text', default: 'Default Address' })
  address: string;

  @ApiProperty({
    description: 'City of the user',
    example: 'New York',
  })
  @Column({ length: 50, default: 'Default City' })
  city: string;

  @Column({ nullable: true, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date?: Date;

  @ApiProperty({
    description: 'Indicates if the user has admin privileges',
    example: false,
    default: false,
  })
  @Column({ type: 'enum', enum: Role, default: Role.User })
  role?: Role;

  @OneToOne(() => Cart, cart => cart.user)
  @JoinColumn()
  cart?: Cart;

  @ApiProperty({
    description: 'List of orders associated with the user',
    type: () => [Order]
  })
  @OneToMany(() => Order, order => order.user)
  orders?: Order[];
}
