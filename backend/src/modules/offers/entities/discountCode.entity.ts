import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'DISCOUNT_CODES' })
export class DiscountCode {
  @ApiProperty({
    description: 'Unique identifier for the discount code',
    example: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ApiProperty({
    description: 'Generated discount code',
    example: 'ABCD1234',
  })
  @Column({ unique: true, nullable: false })
  code: string;

  @ApiProperty({
    description: 'Percentage of the discount',
    example: 15,
  })
  @Column({ type: 'int', nullable: false })
  percentage: number;

  @ApiProperty({
    description: 'Indicates if the code has been used',
    example: false,
  })
  @Column({ default: false, nullable: false })
  used: boolean;
}
