import { UsersService } from './../users/users.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/modules/users/users.repository';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { Auth0Dto, CreateUserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  async signIn(email: string, password: string) {

    const user = await this.usersRepository.findByEmail(email);
    if (!user) throw new BadRequestException("Correo no encontrado")

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) throw new BadRequestException("Contraseña incorrecta")

    const payload = { id: user.id, email: user.email, isAdmin: user.isAdmin }
    const token = this.jwtService.sign(payload)
    return { message: 'Usuario logueado', token }
  }

  async auth0SignIn(email: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new BadRequestException("Usuario no encontrado");
      }

      const payload = { id: user.id, email: user.email, isAdmin: user.isAdmin };
      const token = this.jwtService.sign(payload);
      return { message: 'Usuario logueado', token };
    } catch (error) {
      throw new BadRequestException('Error al iniciar sesión');
    }
  }

  async handleUser(userDto: Auth0Dto) {
    const { id, email, name } = userDto;
    try {
      const pass = "Password01@";
      let user = await this.usersRepository.findByEmail(email);

      if (user) {
        console.log(`Usuario encontrado de primeras: ${JSON.stringify(user)}`);
      } else {
        const newUser = {
          authId: id,
          name: name,
          email: email,
        };
        user = await this.usersService.createAuth0User(newUser);
        user = await this.usersRepository.findByEmail(email);
        console.log(`Usuario creado correctamente: ${JSON.stringify(user)}`);
      }

      if (user.authId === id) {
        return await this.auth0SignIn(email);
      } else {
        console.error(`authId del usuario: ${user.authId}, id recibido: ${id}`);
        throw new BadRequestException("No se pudo iniciar sesión, algunos campos son incorrectos");
      }
    } catch (error) {
      console.error('Error en handleUser:', error.message);
      throw new BadRequestException("No se pudo iniciar sesión con Auth0");
    }
  }

  async signUp(user: CreateUserDto) {
    const { email, password } = user;

    const findUser = await this.usersRepository.findByEmail(email);
    if (findUser) throw new BadRequestException(`El email ${email} ya se encuentra registrado`);

    const encryptedPassword = await bcrypt.hash(password, 10);

    const date = new Date(user.date);

    const newUser = {
      ...user,
      date: user.date,
      password: encryptedPassword
    };
    return await this.usersRepository.createUser(newUser);
  }
}