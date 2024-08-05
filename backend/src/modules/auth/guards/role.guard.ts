import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/modules/users/dto/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [context.getHandler(), context.getClass()]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const hasRole = () => requiredRoles.some((role) => {
      const userRoleIndex = Object.values(Role).indexOf(user.role);
      const requiredRoleIndex = Object.values(Role).indexOf(role);
      return userRoleIndex >= requiredRoleIndex;
    });

    const validUser = user && user.role && hasRole();

    if (!validUser) {
      throw new ForbiddenException('No tienes los permisos necesarios para acceder a esta ruta');
    }
    return true;
  }
}