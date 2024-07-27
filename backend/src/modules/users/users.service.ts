import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly UsersRepository: UsersRepository) {}
  findAll(page: number, limit: number) {
    return this.UsersRepository.getUsers(page, limit);
  }

  findOne(user_id: string) {
    return this.UsersRepository.getUserById(user_id);
  }
  create(createUserDto: CreateUserDto) {
    return this.UsersRepository.createUser(createUserDto);
  }

  update(user_id: string, updateUserDto: UpdateUserDto) {
    return this.UsersRepository.updateUser(user_id, updateUserDto);
  }

  remove(user_id: string) {
    return this.UsersRepository.deleteUser(user_id);
  }
}
