import { ApiProperty } from "@nestjs/swagger";
import { Order } from "src/modules/orders/entities/order.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity({ name: 'USERS' })
export class User {
    @ApiProperty({
        description: 'Unique identifier for the user',
        example: 'b0c0c16d-fcb0-4b89-9d1a-6d09ec6b5de5'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

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
    @Column({ length: 120, nullable: false })
    password: string;

    @ApiProperty({
        description: 'Phone number of the user',
        example: 1234567890
    })
    @Column('int')
    phone: number;

    @ApiProperty({
        description: 'Country of the user',
        example: 'USA'
    })
    @Column({ length: 50 })
    country: string;

    @ApiProperty({
        description: 'Address of the user',
        example: '123 Main St, Apt 4B'
    })
    @Column('text')
    address: string;

    @ApiProperty({
        description: 'City of the user',
        example: 'New York'
    })
    @Column({ length: 50 })
    city: string;

    @ApiProperty({
        description: 'Birthdate of the user in the format yyyy-mm-dd',
        example: '1990-01-01'
    })
    @Column()
    date: Date;

    @ApiProperty({
        description: 'Indicates if the user has admin privileges',
        example: false,
        default: false
    })
    @Column({ default: false })
    isAdmin?: boolean;

    @ApiProperty({
        description: 'List of orders associated with the user',
        type: () => [Order]
    })
    @OneToMany(() => Order, order => order.user)
    orders: Order[];
}