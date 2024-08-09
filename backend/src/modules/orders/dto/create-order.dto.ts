import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsUUID } from "class-validator";
import { Product } from "src/modules/products/entities/product.entity";

export class CreateOrderDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsArray()
  @ArrayMinSize(1)
  products: { productId: string; quantity: number; price: number }[];

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
