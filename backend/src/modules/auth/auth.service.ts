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
  ) {}

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
    const { email, password } = user;

    const findUser = await this.usersRepository.findByEmail(email);
    if (findUser)
      throw new BadRequestException(
        `El email ${email} ya se encuentra registrado`,
      );

    const encryptedPassword = await bcrypt.hash(password, 10);

    const date = new Date(user.date);

    const newUser = {
      ...user,
      date: user.date,
      password: encryptedPassword,
    };
    return await this.usersRepository.createUser(newUser);
  }

  async handleUser(userDto: Auth0Dto) {
    if (!userDto.authId || !userDto.email || !userDto.name) {
      throw new BadRequestException('Missing required fields');
    }
    const { authId, email, name} = userDto;
    const newUser = {
      password: authId,
      confirmPassword: authId,
      name: name,
      authId:authId,
      email: email
    }
    try {
      let user = await this.usersRepository.findByEmail(email);

      if (user) {
        console.log(`Usuario encontrado de primeras: ${JSON.stringify(user)}`);
      } else {
        user = await this.signUp(newUser);
        const findUser = await this.usersRepository.findByEmail(email);
        console.log(`Usuario creado correctamente: ${JSON.stringify(findUser)}`);
        return this.signIn(email,authId);
      }

      const findUser = await this.usersRepository.findByEmail(email);
      if (findUser) {
        return await this.signIn(email,authId);
      } else {
        console.error(`authId del usuario: ${findUser.authId}, id recibido: ${findUser.id}`);
        throw new BadRequestException(
          'No se pudo iniciar sesión, algunos campos son incorrectos',
        );
      }
    } catch (error) {
      console.error('Error en handleUser:', error.message);
      throw new BadRequestException('No se pudo iniciar sesión con Auth0');
    }
  }

}
