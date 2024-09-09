import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import {
  Auth0Dto,
  CreateUserDto,
  updateUserAdminInfoDto,
  UpdateUserDto,
  UpdateUserPersonalInfoDto,
} from './dto/user.dto';
import { Role } from './dto/roles.enum';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUsers() {
    return await this.usersRepository.getUsers();
  }

  async getUserById(userId: string) {
    return await this.usersRepository.getUserById(userId);
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

  async updateFullUser(userId: string, user: Partial<UpdateUserDto>) {
    return await this.usersRepository.updateFullUser(userId, user);
  }

  async updateUserPersonalInfo(
    userId: string,
    user: UpdateUserPersonalInfoDto,
  ) {
    return await this.usersRepository.updateUserPersonalInfo(userId, user);
  }

  async updateUserAdminInfo(userId: string, user: updateUserAdminInfoDto) {
    return await this.usersRepository.updateUserPersonalInfo(userId, user);
  }
  async updateUserRole(userId: string, newRole: Role, currentUser: any) {
    return this.usersRepository.updateUserRole(userId, newRole, currentUser);
  }
  async deleteUser(userId: string) {
    return await this.usersRepository.deleteUser(userId);
  }
}
