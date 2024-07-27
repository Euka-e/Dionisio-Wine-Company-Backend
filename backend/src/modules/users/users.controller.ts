import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.usersService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') user_id: string) {
    return this.usersService.findOne(user_id);
  }

  //? Crear @Get para findByMail ?
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  update(@Param('id') user_id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user_id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') user_id: string) {
    return this.usersService.remove(user_id);
  }
}
