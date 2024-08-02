import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";
import { Cart } from "src/modules/cart/entities/cart.entity";
import { order } from "src/modules/orders/entities/order.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from "typeorm";

@Entity({ name: 'USERS' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({
        description: 'Unique identifier for the user (UUID)',
        example: 'b0c0c16d-fcb0-4b89-9d1a-6d09ec6b5de5'
    })
    id?: string;

    @Column({
        type: 'varchar',
        length: 255,
        unique: true,
        nullable: true
    })
    @ApiProperty({
        description: 'Id de usuario de Google y Auth0',
        minLength: 10,
        maxLength: 255,
        example: 'google-oauth2|1234567890'
    })
    authId?: string;


    @ApiProperty({
        description: 'Name of the user',
        example: 'John Doe'
    })
    @Column({ type: 'varchar', length: 50, nullable: false })
    name: string;

    @ApiProperty({
        description: 'Email address of the user',
        example: 'john.doe@example.com'
    })
    @Column({ length: 50, unique: true, nullable: false })
    email: string;

    @ApiProperty({
        description: 'Password for the user',
        example: 'SecurePassword123'
    })
    @Column({ length: 120, default: "Password" })
    password: string;

    @ApiProperty({
        description: 'Phone number of the user',
        example: 1234567890
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[+]?[0-9\s\-().]+$/, { message: 'Invalid phone number' })
    @Column({ length: 20, default: "20000000000" })
    phone: string;

    @ApiProperty({
        description: 'Country of the user',
        example: 'USA'
    })
    @Column({ length: 50, default: "Default Country" })
    country: string;

    @ApiProperty({
        description: 'Address of the user',
        example: '123 Main St, Apt 4B'
    })
    @Column({ type: 'text', default: "Default Address" })
    address: string;

    @ApiProperty({
        description: 'City of the user',
        example: 'New York'
    })
    @Column({ length: 50, default: "Default City" })
    city: string;

    @Column({ default: "01/01/0001" })
    date: Date

    @ApiProperty({
        description: 'Indicates if the user has admin privileges',
        example: false,
        default: false
    })
    @Column({ default: false })
    isAdmin?: boolean;

    @OneToOne(() => Cart, cart => cart.user)
    @JoinColumn()
    cart?: Cart;

    @ApiProperty({
        description: 'List of orders associated with the user',
        type: () => [order]
    })
    @OneToMany(() => order, order => order.user)
    orders?: order[];
}