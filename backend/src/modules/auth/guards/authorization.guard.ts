import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { expressJwtSecret } from 'jwks-rsa';
import { expressjwt, GetVerificationKey } from 'express-jwt';
import { promisify } from 'util';
import { Role } from 'src/modules/users/dto/roles.enum';

const domain = process.env.AUTH0_DOMAIN;
const audience = process.env.AUTH0_AUDIENCE;

const validateAuth0 = promisify(
  expressjwt({
    secret: expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${domain}.well-known/jwks.json`,
    }) as GetVerificationKey,
    audience: audience,
    issuer: domain,
    algorithms: ['RS256'],
  }),
);

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) throw new UnauthorizedException('Se requiere un token de autorización');

    try {
      const secret = process.env.JWT_SECRET;
      const user = this.jwtService.verify(token, { secret });
      if (!user) throw new UnauthorizedException('Error al validar el token');

      user.exp = new Date(user.exp * 1000);
      user.roles = user.isAdmin ? [Role.Admin] : [Role.User];
      request.user = user;
      return true;
    } catch (err) {
      try {
        await validateAuth0(request, request.res);
        return true;
      } catch (error) {
        throw new UnauthorizedException('Error al validar el token con Auth0');
      }
    }
  }
}
