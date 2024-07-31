import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform {
    transform(value: any) {
        if (typeof value !== 'object' || value === null) {
            throw new BadRequestException('Se esperaba un objeto con la fecha.');
        }

        const dateString = value.date;

        if (typeof dateString !== 'string') {
            throw new BadRequestException('La fecha debe ser una cadena de texto');
        }

        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(dateString)) {
            throw new BadRequestException('La fecha debe estar en formato dd/mm/yyyy');
        }

        const [day, month, year] = dateString.split('/').map(num => parseInt(num, 10));
        const date = new Date(day, month - 1, year);

        if (isNaN(date.getTime())) {
            throw new BadRequestException('Fecha inválida');
        }

        return { ...value, date };
    }
}