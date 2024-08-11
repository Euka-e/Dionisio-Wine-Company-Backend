import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
  Patch,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  updateUserAdminInfoDto,
  UpdateUserDto,
  UpdateUserPersonalInfoDto,
} from './dto/user.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from './dto/roles.enum';
import { AuthGuard } from '../auth/guards/authorization.guard';
import { RolesGuard } from 'src/modules/auth/guards/role.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/currentUser.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Get()
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  async getUsers(@Query('page') page: string, @Query('limit') limit: string) {
    !page ? (page = '1') : page;
    !limit ? (limit = '5') : limit;
    if (page && limit)
      return this.usersService.getUsers(Number(page), Number(limit));
  }

  @ApiBearerAuth()
  @Get(':id')
  @Roles(Role.User, Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  async getUserById(@Param('id', ParseUUIDPipe) userId: string) {
    return this.usersService.getUserById(userId);
  }

  //! ESTE ENDPOINT ACTUALIZA TODOS LOS DATOS DE USER
  //! habria que partirlo en distintos endpoints para mas control
  @ApiBearerAuth()
  @Patch(':id')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  async updateFullUser(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() user: UpdateUserDto,
  ) {
    return this.usersService.updateFullUser(userId, user);
  }

  //! ESTE ENDPOINT SE PUEDE ABREVIAR A UpdateUserInfo
  @ApiBearerAuth()
  @Patch('info/:id')
  @Roles(Role.User, Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  async updateUserPersonalInfo(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() user: UpdateUserPersonalInfoDto,
  ) {
    return this.usersService.updateUserPersonalInfo(userId, user);
  }

  @ApiBearerAuth()
  @Patch('admin-info/:id')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  async updateUserAdminInfo(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() user: updateUserAdminInfoDto,
  ) {
    return this.usersService.updateUserPersonalInfo(userId, user);
  }

  @Patch('role/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async updateUserRole(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body('role') newRole: Role,
    @CurrentUser() currentUser: any,
  ) {
    return this.usersService.updateUserRole(userId, newRole, currentUser);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  async deleteUser(@Param('id', ParseUUIDPipe) userId: string) {
    return this.usersService.deleteUser(userId);
  }
}
