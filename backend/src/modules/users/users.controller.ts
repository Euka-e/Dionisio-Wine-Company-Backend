import {
  Body,
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Patch,
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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/currentUser.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve a paginated list of users',
    description: `This endpoint retrieves a list of users with pagination support.
    - Query parameters control pagination.
    - The response will include user details such as name, email, and roles.
    - Default values are page 1 and limit 5 if not provided.`,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number for pagination',
    example: '1',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of users per page',
    example: '5',
    required: false,
  })
  @Get()
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  async getUsers() {
    return this.usersService.getUsers();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve a user by ID',
    description: `This endpoint retrieves a user based on their unique ID.
      - The ID is provided as a URL parameter.
      - The response will include user details such as name, email, roles, and other relevant information.`,
  })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the user to retrieve',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Get(':id')
  @Roles(Role.User, Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  async getUserById(@Param('id', ParseUUIDPipe) userId: string) {
    return this.usersService.getUserById(userId);
  }

  //! ESTE ENDPOINT ACTUALIZA TODOS LOS DATOS DE USER
  //! habria que partirlo en distintos endpoints para mas control
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update all user details',
    description: `This endpoint updates all details of a user.
    - It requires authentication and authorization with either Admin or SuperAdmin role.
    - The request body should include all user details such as name, email, roles, etc.
    - The user ID is provided as a URL parameter.`,
  })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the user to update',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    description: 'User details to update',
    type: UpdateUserDto,
  })
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
  @ApiOperation({
    summary: 'Update personal information of a user',
    description: `This endpoint updates personal information of a user.
    - It requires authentication and authorization with User, Admin, or SuperAdmin role.
    - The request body should include personal information to update such as name and contact details.
    - The user ID is provided as a URL parameter.`,
  })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the user to update',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    description: 'Personal information to update',
    type: UpdateUserPersonalInfoDto,
  })
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
  @ApiOperation({
    summary: 'Update administrative information of a user',
    description: `This endpoint updates administrative information of a user, such as roles and permissions.
    - It requires authentication and authorization with Admin or SuperAdmin role.
    - The request body should include administrative details to update.
    - The user ID is provided as a URL parameter.`,
  })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the user to update',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    description: 'Administrative information to update',
    type: updateUserAdminInfoDto,
  }) @Patch('admin-info/:id')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  async updateUserAdminInfo(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() user: updateUserAdminInfoDto,
  ) {
    return this.usersService.updateUserPersonalInfo(userId, user);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update the role of a user',
    description: `This endpoint updates the role of a user.
    - It requires authentication and authorization with Admin or SuperAdmin role.
    - The request body should include the new role for the user.
    - The user ID is provided as a URL parameter.`,
  })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the user whose role is to be updated',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    description: 'The new role to assign to the user',
    schema: {
      type: 'object',
      properties: {
        role: {
          type: 'string',
          enum: Object.values(Role),
          example: Role.Admin,
          description: 'The new role for the user',
        },
      },
      required: ['role'],
    },
  })
  @Patch('role/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        role: {
          type: 'string',
          enum: Object.values(Role),
          example: Role.Admin,
          description: 'The new role for the user',
        },
      },
    },
  })
  async updateUserRole(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body('role') newRole: Role,
    @CurrentUser() currentUser: any,
  ) {
    return this.usersService.updateUserRole(userId, newRole, currentUser);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a user',
    description: `This endpoint deletes a user from the system.
    - It requires authentication and authorization with SuperAdmin role.
    - The user ID is provided as a URL parameter.`,
  })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the user to delete',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  async deleteUser(@Param('id', ParseUUIDPipe) userId: string) {
    return this.usersService.deleteUser(userId);
  }
}
