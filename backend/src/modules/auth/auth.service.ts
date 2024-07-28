import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UsersRepository } from '../users/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService
  ) { }

  async signIn(email: string, password: string) {
    const user = await this.usersRepository.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException("Correo o contraseña incorrectos");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new BadRequestException("Correo o contraseña incorrectos");
    }

    const payload = { id: user.id, email: user.email, isAdmin: user.isAdmin };
    const token = this.jwtService.sign(payload);
    return { message: 'Usuario logueado', token };
  }

  async signUp(user: User) {
    const { email, password } = user;
    const findUser = await this.usersRepository.getUserByEmail(email);
    if (findUser) throw new BadRequestException(`El email ${email} ya se encuentra registrado`);
    const encryptedPassword = await bcrypt.hash(password, 10);
    return await this.usersRepository.createUser({ ...user, password: encryptedPassword });
  }

  async signInWithAuth0(user: Partial<User>) {
    const payload = { sub: user.id, email: user.email.valueOf };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
