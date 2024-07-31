import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform {
    transform(value: any) {
        if (typeof value !== 'object' || value === null) {
            throw new BadRequestException('Se esperaba un objeto con la fecha.');
        }

        // Asegúrate de que el campo date está presente
        const dateString = value.date;

        if (typeof dateString !== 'string') {
            throw new BadRequestException('La fecha debe ser una cadena de texto');
        }

        // Validar el formato de la fecha usando una expresión regular
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(dateString)) {
            throw new BadRequestException('La fecha debe estar en formato dd/mm/yyyy');
        }

        // Descomponer la fecha en día, mes y año
        const [day, month, year] = dateString.split('/').map(num => parseInt(num, 10));
        const date = new Date(year, month - 1, day);

        // Verificar si la fecha es válida
        if (isNaN(date.getTime())) {
            throw new BadRequestException('Fecha inválida');
        }

        // Reemplazar el campo date en el objeto
        return { ...value, date };
    }
}