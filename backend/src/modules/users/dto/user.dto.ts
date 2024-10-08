import {
  ApiHideProperty,
  ApiProperty,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
  IsString,
  IsNumber,
  Validate,
  IsEmpty,
  IsDateString,
  IsOptional,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { PasswordMatch } from '../../../decorators/passwordMatch.decorator';
import { Role } from './roles.enum';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    minLength: 3,
    maxLength: 80,
    example: 'Juan Pérez',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 80)
  name: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@example.com',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'ID debe tener un máximo de 255 caracteres' })
  id?: string;

  @ApiProperty({
    description: 'Id de usuario de google y auth0',
    example: 'google-oauth2|1234567890',
  })
  @IsOptional()
  @IsString()
  authId?: string;

  @ApiProperty({
    description:
      'Contraseña del usuario. Debe tener al menos una letra minúscula, una mayúscula, un número y un carácter especial (!@#$%^&*)',
    minLength: 8,
    maxLength: 120,
    example: 'Password123!',
  })
  @IsNotEmpty()
  @Length(8, 120)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/, {
    message:
      'La contraseña debe tener al menos: Una letra minúscula, una mayúscula, un número y uno de los siguientes caracteres: !@#$%^&*',
  })
  password: string;

  @ApiProperty({
    description: 'Confirmación de la contraseña del usuario',
    example: 'Password123!',
  })
  @IsNotEmpty()
  @Validate(PasswordMatch, ['password'])
  confirmPassword: string;

  @ApiProperty({
    description: 'Dirección del usuario',
    minLength: 3,
    maxLength: 80,
    example: 'Calle Falsa 123',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 80)
  address?: string;

  @ApiProperty({
    description: 'Número de teléfono del usuario',
    example: 1234567890,
  })
  @IsNotEmpty()
  @IsNumber()
  phone?: string;

  @ApiProperty({
    description: 'País del usuario',
    minLength: 4,
    maxLength: 20,
    example: 'México',
  })
  @IsNotEmpty()
  @IsString()
  @Length(4, 20)
  country?: string;

  @ApiProperty({
    description: 'Ciudad del usuario',
    minLength: 5,
    maxLength: 20,
    example: 'Ciudad de México',
  })
  @IsNotEmpty()
  @IsString()
  @Length(5, 20)
  city?: string;

  @ApiProperty({
    description: 'Fecha de nacimiento del usuario',
    example: '20/09/2024',
  })
  @IsNotEmpty()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: 'La fecha debe estar en formato dd/mm/yyyy',
  })
  date?: Date;

  @ApiHideProperty()
  @IsEmpty() //! Si quitamos esta propiedad y la de arriba, podemos hacer un patch para cambiar el rol de un usuario
  /*@IsEnum(Role)*/ //? Si agregamos esta propiedad, podemos hacer un patch para cambiar el rol de un usuario
  role?: Role;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class LoginUserDto extends PickType(CreateUserDto, [
  'email',
  'password',
]) {}

//! Agregar Email aca? Agregar contraseña aca? o manejar aparte en un endpoint distinto sin dto?
export class UpdateUserPersonalInfoDto extends PartialType(
  PickType(CreateUserDto, [
    'name',
    'address',
    'phone',
    'country',
    'city',
  ] as const),
) {}

export class updateUserAdminInfoDto extends PartialType(
  PickType(CreateUserDto, ['name', 'email'] as const),
) {}

export class Auth0Dto {
  @ApiProperty({
    description: 'Id de usuario de google y auth0',
    example: 'google-oauth2|1234567890',
  })
  @IsOptional()
  @IsString()
  authId: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    minLength: 3,
    maxLength: 80,
    example: 'Juan Pérez',
  })
  @IsString()
  @Length(3, 80)
  name: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
