import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, Matches, IsString, IsNumber, IsEmpty } from 'class-validator';


export class CreateUserDto {

    @ApiProperty({
        description: 'Name of the user',
        example: 'John Doe'
    })
    @IsNotEmpty()
    @IsString()
    @Length(3, 80)
    name: string;

    @ApiProperty({
        description: 'Email of the user',
        example: 'john.doe@example.com'
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Password of the user',
        example: 'Password123!'
    })
    @IsNotEmpty()
    @Length(8, 120)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/,
        { message: 'La contraseña debe tener al menos: Una letra minúscula, una mayúscula, un número y uno de los siguientes caracteres: !@#$%^&*' })
    password: string;

    @ApiProperty({
        description: 'Confirmation of the password',
        example: 'Password123!'
    })
    @IsNotEmpty()
    confirmPassword: string;

    @ApiProperty({
        description: 'Address of the user',
        example: '123 Main St'
    })
    @IsNotEmpty()
    @IsString()
    @Length(3, 80)
    address: string;

    @ApiProperty({
        description: 'Phone number of the user',
        example: 1234567890
    })
    @IsNotEmpty()
    @IsNumber()
    phone: number;

    @ApiProperty({
        description: 'Country of the user',
        example: 'USA'
    })
    @IsNotEmpty()
    @IsString()
    @Length(4, 20)
    country: string;

    @ApiProperty({
        description: 'City of the user',
        example: 'New York'
    })
    @IsNotEmpty()
    @IsString()
    @Length(5, 20)
    city: string;

    @ApiProperty({
        description: 'Birthdate of the user in the format dd/mm/yyyy',
        example: '01/01/1990'
    })
    @IsNotEmpty()
    @Matches(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'La fecha debe estar en formato dd/mm/yyyy' })
    date: Date;

    @ApiProperty({
        description: 'Indicates if the user is an admin',
        example: false,
        default: false
    })
    @IsEmpty()
    isAdmin?: boolean;
}

export class UpdateUserDto extends PartialType(CreateUserDto) { }

export class LoginUserDto extends PickType(CreateUserDto, [
    'email', 'password']) { }