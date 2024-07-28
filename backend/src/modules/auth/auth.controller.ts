import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from 'src/modules/users/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('login')
  @UseGuards(AuthGuard('auth0'))
  async login() { } //? Acá va a dirigir a la autorización de auth0

  @Get('callback')
  @UseGuards(AuthGuard('auth0'))
  async callback(@Req() req, @Res() res) {
    const jwt = await this.authService.signInWithAuth0(req.user);
    res.redirect(`https://dionisio-wine-company-backend.onrender.com/callback`);
  }

  @Get('logout')
  logout(@Req() req, @Res() res) {
    req.logout();
    res.redirect('/');
  }

  @Get('status')
  @UseGuards(AuthGuard('auth0'))
  status(@Req() req) {
    return req.user;
  }
  
  @Post('signin')
  signIn(@Body() credentials: LoginUserDto) {
    const { email, password } = credentials;
    return this.authService.signIn(email, password);
  }
  @Post('signup')
  async signUp(@Body() user: CreateUserDto) {
    return await this.authService.signUp(user);
  }
}
