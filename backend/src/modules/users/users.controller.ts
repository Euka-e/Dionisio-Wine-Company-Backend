import { AuthGuard } from '../auth/guards/authorization.guard';
import { Body, Controller, Get, Post, Put, Param, Delete, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/user.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from './dto/roles.enum';
import { RolesGuard } from 'src/modules/auth/guards/role.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) { }

  @ApiBearerAuth()
  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  getUsers(@Query('page') page: string, @Query('limit') limit: string) {
    !page ? (page = '1') : page;
    !limit ? (limit = '5') : limit;
    if (page && limit) return this.usersService.getUsers(Number(page), Number(limit));
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthGuard)
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserById(id)
  }

  @ApiBearerAuth()
  @Put(':id')
  @UseGuards(AuthGuard)
  updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() user: UpdateUserDto) {
    return this.usersService.updateUser(id, user);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }

}