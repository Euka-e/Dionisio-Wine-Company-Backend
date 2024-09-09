import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { OrderStatus } from "../entities/order.status.enum";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateOrderDto {

    @ApiProperty({
        description: 'UUID of the order to be updated',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    })
    @IsNotEmpty()
    @IsUUID()
    orderId: string;

    @ApiProperty({
        description: 'New status for the order',
        enum: OrderStatus,
        example: OrderStatus.SHIPPED,
    })
    @IsNotEmpty()
    @IsEnum(OrderStatus)
    status: OrderStatus;

}

/* import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { OrderStatus } from "../entities/order.status.enum";

export class UpdateOrderDto {

    @IsNotEmpty()
    @IsUUID()
    orderId: string

    @IsNotEmpty()
    @IsEnum(OrderStatus)
    status: OrderStatus

}
 */