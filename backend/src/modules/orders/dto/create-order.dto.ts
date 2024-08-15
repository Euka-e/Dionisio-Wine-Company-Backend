import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateOrderDto {
  
  @ApiProperty({
    description: 'Array of cart items with product ID, quantity, and price',
    example: [
      { productId: '123e4567-e89b-12d3-a456-426614174000', quantity: 2, price: 19.99 },
      { productId: '123e4567-e89b-12d3-a456-426614174001', quantity: 1, price: 39.99 }
    ],
    type: Array,
    items: {
      type: 'object',
      properties: {
        productId: {
          type: 'string',
          format: 'uuid',
          example: '123e4567-e89b-12d3-a456-426614174000',
          description: 'UUID of the product'
        },
        quantity: {
          type: 'number',
          example: 2,
          description: 'Quantity of the product'
        },
        price: {
          type: 'number',
          example: 19.99,
          description: 'Price of the product'
        }
      }
    }
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty()
  cartItems: { productId: string; quantity: number; price: number }[];

  @ApiProperty({
    description: 'Total price of the order',
    example: 79.97,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'UUID of the user placing the order',
    example: '123e4567-e89b-12d3-a456-426614174002',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
