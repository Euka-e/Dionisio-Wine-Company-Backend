import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform {
    transform(value: any) {
        if (typeof value !== 'string') {
            throw new BadRequestException('La fecha debe ser una cadena de texto');
        }

        const [day, month, year] = value.split('/');
        const date = new Date(`${year}-${month}-${day}`);

        if (isNaN(date.getTime())) {
            throw new BadRequestException('Fecha inválida');
        }

        return date;
    }
}