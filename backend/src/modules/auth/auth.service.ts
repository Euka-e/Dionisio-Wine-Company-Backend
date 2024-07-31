import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersRepository } from 'src/modules/users/users.repository';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService
  ) { }
  getAuth() {
    return "Todas las credenciales..."
  }

  async signIn(email: string, password: string) {

    const user = await this.usersRepository.getUserByEmail(email);
    if (!user) throw new BadRequestException("Correo o contraseña incorrectos")

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) throw new BadRequestException("Correo o contraseña incorrectos")

    const payload = { id: user.id, email: user.email, isAdmin: user.isAdmin }
    const token = this.jwtService.sign(payload)
    return { message: 'Usuario logueado', token }
  }
  async signUp(user: CreateUserDto) {
    const { email, password } = user;

    const findUser = await this.usersRepository.getUserByEmail(email);
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