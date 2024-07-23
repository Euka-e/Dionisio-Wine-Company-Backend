import { PartialType, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, Matches, IsString, IsNumber, IsEmpty } from 'class-validator';

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    @Length(3, 80)
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(8, 120)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/,
        { message: 'La contraseña debe tener al menos: Una letra minúscula, una mayúscula, un número y uno de los siguientes caracteres: !@#$%^&*' })
    password: string;

    @IsNotEmpty()
    confirmPassword: string

    @IsNotEmpty()
    @IsString()
    @Length(3, 80)
    address: string;

    @IsNotEmpty()
    @IsNumber()
    phone: number;

    @IsNotEmpty()
    @IsString()
    @Length(4, 20)
    country: string;

    @IsNotEmpty()
    @IsString()
    @Length(5, 20)
    city: string;

    @IsNotEmpty()
    @Matches(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'La fecha debe estar en formato dd/mm/yyyy' })
    date: Date;

    @IsEmpty()
    isAdmin?: boolean
}

export class UpdateUserDto extends PartialType(CreateUserDto) { }

export class LoginUserDto extends PickType(CreateUserDto, [
    'email', 'password']) { }