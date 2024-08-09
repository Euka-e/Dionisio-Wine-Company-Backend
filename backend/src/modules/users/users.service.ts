import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { Auth0Dto, CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { Role } from './dto/roles.enum';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUsers(page: number, limit: number) {
    return await this.usersRepository.getUsers(page, limit);
  }

  async getUserById(id: string) {
    return await this.usersRepository.getUserById(id);
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findByEmail(email);
  }

  async createUser(user: CreateUserDto) {
    return await this.usersRepository.createUser(user);
  }

  async createAuth0User(user: Auth0Dto) {
    return await this.usersRepository.createAuth0User(user);
  }

  async updateUser(id: string, user: Partial<UpdateUserDto>) {
    return await this.usersRepository.updateUser(id, user);
  }

  async deleteUser(id: string) {
    return await this.usersRepository.deleteUser(id);
  }

  async updateUserRole(userId: string, newRole: Role, currentUser: any) {
    return this.usersRepository.updateUserRole(userId, newRole, currentUser);
  }
}
