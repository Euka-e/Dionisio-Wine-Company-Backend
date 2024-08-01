import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth0Dto, CreateUserDto, LoginUserDto } from '../users/dto/user.dto';
import { ApiTags } from '@nestjs/swagger';
import { ParseDatePipe } from '../../pipes/parseDate.pipe';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get()
  getAuth() {
    return this.authService.getAuth();
  }

  @Post('user')
  async handleUser(@Body() userDto: Auth0Dto) {
    return await this.authService.handleUser(userDto);
  }

  @Post('signin')
  signIn(@Body() credentials: LoginUserDto) {
    const { email, password } = credentials;
    return this.authService.signIn(email, password);
  }
  @Post('signup')
  @UsePipes(new ParseDatePipe())
  async signUp(@Body() user: CreateUserDto) {
    return await this.authService.signUp(user);
  }
}