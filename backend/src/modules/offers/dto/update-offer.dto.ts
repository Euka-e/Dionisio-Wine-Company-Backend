import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOfferDto {
    @ApiProperty({
        description: 'Porcentaje de descuento de la oferta',
        example: 15,
    })
    @IsOptional()
    @IsNumber()
    percentage?: number;

    @ApiProperty({
        description: 'Fecha de expiración de la oferta',
        example: '2024-12-31',
    })
    @IsOptional()
    dueDate?: Date;

    @ApiProperty({
        description: 'ID del producto al que se aplica la oferta',
        example: 'uuid_de_producto',
    })
    @IsOptional()
    @IsString()
    productId?: string;

    @ApiProperty({
        description: 'ID de la categoría a la que se aplica la oferta',
        example: 'uuid_de_categoria',
    })
    @IsOptional()
    @IsString()
    categoryId?: string;
}
