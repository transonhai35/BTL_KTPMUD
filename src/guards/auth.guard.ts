import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard extends NestAuthGuard(['jwt']) {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const optional = this.reflector.get<boolean>('optional', context.getHandler());
    const request: Request = context.switchToHttp().getRequest();

    if (optional) {
      const token = request.headers.authorization;
      if (!token) {
        return true; 
      }
      return super.canActivate(context);
    }
    return super.canActivate(context);
  }
}
