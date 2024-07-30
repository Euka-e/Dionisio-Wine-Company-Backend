import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role } from '../../users/dto/roles.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService
  ) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization?.split(' ')[1]
    if (!token) throw new UnauthorizedException('Se necesita un token de autorización')
    try {
      const secret = process.env.JWT_SECRET

      const user = this.jwtService.verify(token, { secret })
      if (!user) { throw new UnauthorizedException("Error al validar el token") }

      user.exp = new Date(user.exp * 1000)

      user.roles = user.isAdmin ? [Role.Admin] : [Role.User]
      request.user = user;
      return true
    } catch (error) {
      throw new UnauthorizedException("Error al validar el token")
    }
  }
}