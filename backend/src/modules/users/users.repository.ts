import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth0Dto, CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { MailingService } from '../mailing/mailing.service';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly mailingService: MailingService,
  ) {}

  async getUsers(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;
      const users = await this.usersRepository.find({
        take: limit,
        skip: skip,
      });
      const passwordlessUsers = users.map((user) => {
        const usersArray = [];
        const { password, ...userWithoutPassword } = user;
        usersArray.push(userWithoutPassword);
        return usersArray;
      });
      return passwordlessUsers;
    } catch (error) {
      console.error('Error obteniendo los usuarios:', error);
      throw new InternalServerErrorException(
        'No se pudieron obtener los usuarios.',
      );
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: { orders: true },
      });
      if (!user) {
        throw new NotFoundException(
          `No se encontró el usuario con el id ${id}`,
        );
      }
      return user;
    } catch (error) {
      console.error(`Error obteniendo el usuario con el id ${id}:`, error);
      throw new InternalServerErrorException(
        `No se pudo obtener el usuario con id ${id}.`,
      );
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.usersRepository.findOneBy({ email });
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      throw new NotFoundException(
        `No se encontró el usuario con el email ${email}`,
      );
    }
  }

  async createUser(user: CreateUserDto) {
    const { email, date } = user;
    try {
      if (typeof date === 'string') {
        user.date = new Date(date);
      }

      await this.usersRepository.save(user);
      const findUser = await this.findByEmail(email);
      const { role, ...finalUser } = findUser;

      await this.mailingService.sendWelcomeEmail(email);
      console.log('Correo de bienvenida enviado correctamente');

      return finalUser;
    } catch (error) {
      console.error('Error creando usuario:', error.message);
      throw new InternalServerErrorException('No se pudo crear el usuario.');
    }
  }

  async createAuth0User(userDto: Auth0Dto) {
    const { authId, email, name } = userDto;
    try {
      const user = new User();
      user.authId = authId;
      user.name = name;
      user.email = email;
      const encryptedPassword = await bcrypt.hash(authId, 10);
      user.password = encryptedPassword;
      await this.usersRepository.save(user);
      const findUser = await this.findByEmail(email);
      const { role, ...finalUser } = findUser;
      return finalUser;
    } catch (error) {
      console.error('Error creando usuario:', error.message);
      throw new InternalServerErrorException('No se pudo crear el usuario.');
    }
  }

  async updateUser(id: string, user: Partial<UpdateUserDto>) {
    try {
      await this.usersRepository.update(id, user);
      const updatedUser = await this.usersRepository.findOneBy({ id });
      if (!updatedUser) {
        throw new NotFoundException(
          `No se encontró el usuario con el id ${id}`,
        );
      }
      const { password, role, ...finalUser } = updatedUser;
      return finalUser;
    } catch (error) {
      console.error(`Error actualizando el usuario con el id ${id}:`, error);
      throw new InternalServerErrorException(
        `No se pudo actualizar el usuario con el id ${id}.`,
      );
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException(
          `No se encontró el usuario con el id ${id}`,
        );
      }
      await this.usersRepository.remove(user);
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error(`Error eliminando el usuario con el id ${id}:`, error);
      throw new InternalServerErrorException(
        `No se pudo eliminar el usuario con el id ${id}.`,
      );
    }
  }
}
