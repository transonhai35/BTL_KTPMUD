import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { UserEntity } from "../modules/database";
import { Request } from 'express';

export const AuthUser = createParamDecorator((key: keyof UserEntity, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  const user = request['user'] as UserEntity;
  return key ? user?.[key] : user;
});