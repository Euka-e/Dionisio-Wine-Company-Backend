import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) { }

    async getUsers(page: number, limit: number) {
        return await this.usersRepository.getUsers(page, limit)
    }

    async getUserById(id: string) {
        return await this.usersRepository.getUserById(id)
    }

    async createUser(user: CreateUserDto) {
        return await this.usersRepository.createUser(user);
    }

    async updateUser(id: string, user: Partial<UpdateUserDto>) {
        return await this.usersRepository.updateUser(id, user);
    }

    async deleteUser(id: string) {
        return await this.usersRepository.deleteUser(id);
    }
}