import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth0Dto, CreateUserDto, LoginUserDto } from '../users/dto/user.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParseDatePipe } from '../../pipes/parseDate.pipe';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({
    summary: 'Handle user registration',
    description: `This endpoint is used for handling user registration.
      - The request body should contain user information formatted according to the Auth0Dto.
      - The Auth0Dto includes fields such as authId, name, and email, which are necessary for user registration or updates.
      - Depending on the implementation of the AuthService, this endpoint may register a new user or update an existing user's information in the system.`,
  })
  @ApiBody({
    description: 'User details for registration or update',
    type: Auth0Dto,
  })
  @Post('user')
  async handleUser(@Body() userDto: Auth0Dto) {
    return await this.authService.handleUser(userDto);
  }

  @ApiOperation({
    summary: 'Sign in a user',
    description: `This endpoint is used for user sign-in.
      - The request body should contain the user's credentials in the format defined by LoginUserDto.
      - The LoginUserDto includes fields for email and password.
      - The endpoint will authenticate the user with the provided email and password and return an authentication token if the credentials are valid.
      - If the credentials are incorrect, an error response will be provided.`,
  })
  @ApiBody({
    description: 'User credentials for sign-in',
    type: LoginUserDto,
  })
  @Post('signin')
  signIn(@Body() credentials: LoginUserDto) {
    const { email, password } = credentials;
    return this.authService.signIn(email, password);
  }

/*   @Post('signup')
  @UsePipes(new ParseDatePipe())
  async signUp(@Body() user: CreateUserDto) {
    return await this.authService.signUp(user);
  } */
}