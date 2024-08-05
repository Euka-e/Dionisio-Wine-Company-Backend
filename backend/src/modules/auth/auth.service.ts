import { UsersService } from './../users/users.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/modules/users/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Auth0Dto, CreateUserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async signIn(email: string, password: string) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new BadRequestException('Correo no encontrado');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new BadRequestException('Contraseña incorrecta');

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    return { message: 'Usuario logueado', token };
  }

  async auth0SignIn(email: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new BadRequestException('Usuario no encontrado');
      }

      const payload = { id: user.id, email: user.email, role: user.role };
      const token = this.jwtService.sign(payload);
      return { message: 'Usuario logueado', token };
    } catch (error) {
      throw new BadRequestException('Error al iniciar sesión');
    }
  }

  async signUp(user: CreateUserDto) {
    const { email, password, date } = user;

    const findUser = await this.usersRepository.findByEmail(email);
    if (findUser) {
      throw new BadRequestException(`El email ${email} ya se encuentra registrado`);
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      ...user,
      password: encryptedPassword,
    };

    if (date && !(date instanceof Date)) {
      newUser.date = new Date(date);
    }

    return await this.usersRepository.createUser(newUser);
  }

  async handleUser(userDto: Auth0Dto) {
    if (!userDto.authId || !userDto.email || !userDto.name) {
      throw new BadRequestException('Missing required fields');
    }

    const { authId, email, name } = userDto;

    try {
      let user = await this.usersRepository.findByEmail(email);
      console.log('Usuario encontrado de primeras:', user);

      if (!user) {
        console.log('Usuario no encontrado, creando nuevo usuario');
        const newUserDto: CreateUserDto = {
          name: name,
          authId: authId,
          email: email,
          password: authId,
          confirmPassword: authId,
        };
        await this.signUp(newUserDto);
        user = await this.usersRepository.findByEmail(email);
        console.log('Usuario creado:', user);
      }

      if (user) {
        console.log('Usuario encontrado para el inicio de sesión:', user);
        return await this.signIn(email, authId);
      } else {
        throw new BadRequestException('User could not be created or found');
      }
    } catch (error) {
      console.error('Error en handleUser:', error.message);
      throw new BadRequestException('Error handling user with Auth0');
    }
  }
}
