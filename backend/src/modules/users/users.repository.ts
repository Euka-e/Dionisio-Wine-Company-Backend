import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto, UpdateUserDto } from "./dto/user.dto";

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>
  ) { }

  async getUsers(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;
      const users = await this.usersRepository.find({
        take: limit,
        skip: skip
      });
      return users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
    } catch (error) {
      console.error('Error obteniendo los usuarios:', error);
      throw new InternalServerErrorException('No se pudieron obtener los usuarios.');
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: { orders: true }
      });
      if (!user) {
        throw new NotFoundException(`No se encontró el usuario con el id ${id}`);
      }
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error(`Error obteniendo el usuario con el id ${id}:`, error);
      throw new InternalServerErrorException(`No se pudo obtener el usuario con id ${id}.`);
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
      throw new NotFoundException(`No se encontró el usuario con el email ${email}`);
    }

  }

  async createUser(user: CreateUserDto) {
    try {
      if (typeof user.date === 'string') {
        user.date = new Date(user.date);
      }

      const newUser = await this.usersRepository.save(user);
      const findUser = await this.usersRepository.findOneBy({ id: newUser.id });
      const { isAdmin, ...finalUser } = findUser;
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
        throw new NotFoundException(`No se encontró el usuario con el id ${id}`);
      }
      const { password, isAdmin, ...finalUser } = updatedUser;
      return finalUser;
    } catch (error) {
      console.error(`Error actualizando el usuario con el id ${id}:`, error);
      throw new InternalServerErrorException(`No se pudo actualizar el usuario con el id ${id}.`);
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException(`No se encontró el usuario con el id ${id}`);
      }
      await this.usersRepository.remove(user);
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error(`Error eliminando el usuario con el id ${id}:`, error);
      throw new InternalServerErrorException(`No se pudo eliminar el usuario con el id ${id}.`);
    }
  }

}