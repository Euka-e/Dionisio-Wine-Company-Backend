import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class CreateOrderDto {

  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty()
  cartItems: { productId: string; quantity: number; price: number }[];

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
