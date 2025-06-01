import {
  applyDecorators,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { AuthGuard } from '../guards/auth.guard';
import { AuthUserInterceptor } from '../interceptors/auth-user.interceptor';
import { RoleGuard } from '../guards/role.guard';
import { AccountTypeEnum, RoleTypeEnum } from '../common/enums';
import { AccountTypeGuard } from '../guards/account-type.guard';

export function UseGuardAuth(params?: {
  optional?: boolean;
  roles?: RoleTypeEnum[];
  accountTypes?: AccountTypeEnum[];
}) {
  return applyDecorators(
    SetMetadata('optional', params?.optional),
    SetMetadata('roles', params?.roles),
    SetMetadata('accountTypes', params?.accountTypes),
    UseGuards(AuthGuard, RoleGuard, AccountTypeGuard),
    ApiBearerAuth(),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
