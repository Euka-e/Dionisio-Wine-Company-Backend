import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) { }

  async getUsers(page: number = 1, limit: number = 10) {
    try {
      const [users, total] = await this.usersRepository.findAndCount({
        take: limit,
        skip: (page - 1) * limit,
      })
      const filteredUsers = users.map(({ password, ...userWithoutPassword }) => userWithoutPassword)
      return {
        data: filteredUsers,
        total,
        page,
        lastPage: Math.ceil(total / limit)
      }
    } catch (error) {
      console.error('Error obteniendo los usuarios:', error);
      throw new InternalServerErrorException(
        'No se pudieron obtener los usuarios.',
      );
    }
  }

  async getUserById(user_id: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: user_id },
        relations: { orders: true },
      });
      if (!user) {
        throw new NotFoundException(
          `No se encontró el usuario con el id ${user_id}`,
        );
      }
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error(`Error obteniendo el usuario con el id ${user_id}:`, error);
      throw new InternalServerErrorException(
        `No se pudo obtener el usuario con id ${user_id}.`,
      );
    }
  }

  //? Ver logica para utilizar este endpoint
  //? un if-else en el Controlador u otro endpoint separado
  async getUserByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      return null;
    }
    return user;
  }

  async createUser(user: Partial<User>) {
    try {
      const newUser = await this.usersRepository.save(user);
      const findUser = await this.usersRepository.findOneBy({ id: newUser.id });
      const { isAdmin, ...finalUser } = findUser;
      return finalUser;
    } catch (error) {
      console.error('Error creando usuario:', error.message);
      throw new InternalServerErrorException('No se pudo crear el usuario.');
    }
  }

  async updateUser(user_id: string, user: UpdateUserDto) {
    try {
      await this.usersRepository.update(user_id, user);
      const updatedUser = await this.usersRepository.findOneBy({ id: user_id });
      if (!updatedUser) {
        throw new NotFoundException(
          `No se encontró el usuario con el id ${user_id}`,
        );
      }
      const { password, isAdmin, ...finalUser } = updatedUser;
      return finalUser;
    } catch (error) {
      console.error(
        `Error actualizando el usuario con el id ${user_id}:`,
        error,
      );
      throw new InternalServerErrorException(
        `No se pudo actualizar el usuario con el id ${user_id}.`,
      );
    }
  }

  async deleteUser(user_id: string) {
    try {
      const user = await this.usersRepository.findOneBy({ id: user_id });
      if (!user) {
        throw new NotFoundException(
          `No se encontró el usuario con el id ${user_id}`,
        );
      }
      await this.usersRepository.remove(user);
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error(`Error eliminando el usuario con el id ${user_id}:`, error);
      throw new InternalServerErrorException(
        `No se pudo eliminar el usuario con el id ${user_id}.`,
      );
    }
  }
}
