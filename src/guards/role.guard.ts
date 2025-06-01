import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[] | undefined>(
      'roles',
      context.getHandler(),
    );

    const optional = this.reflector.get<boolean>(
      'optional',
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user && !optional) {
      return false;
    }

    if (requiredRoles?.length && !requiredRoles.includes(user.role)) {
      return false;
    }

    return true;
  }
}
