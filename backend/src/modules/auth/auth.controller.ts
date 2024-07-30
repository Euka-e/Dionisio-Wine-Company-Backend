import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../users/dto/user.dto';
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