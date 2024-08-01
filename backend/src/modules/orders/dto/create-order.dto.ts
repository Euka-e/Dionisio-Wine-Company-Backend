import { ArrayMinSize, IsArray, IsNotEmpty, IsUUID } from "class-validator";
import { Product } from "src/modules/products/entities/product.entity";

export class CreateOrderDto {
  /**
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  /**
   * @example 
	"products": [
		{
			"id": "7a30d3fe-68b4-4fb5-a916-5a6105771bfc"
		},
		{
			"id":"bac533fa-dd50-4e19-a924-b1fb801f8eab"
		}
	]
   */
  @IsArray()
  @ArrayMinSize(1)
  products: Partial<Product[]>;
}