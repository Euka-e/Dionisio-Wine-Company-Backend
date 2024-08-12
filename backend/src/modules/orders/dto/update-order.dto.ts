import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { OrderStatus } from "../entities/order.status.enum";

export class UpdateOrderDto {

    @IsNotEmpty()
    @IsUUID()
    orderId: string

    @IsNotEmpty()
    @IsEnum(OrderStatus)
    status: OrderStatus

}
