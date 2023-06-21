import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from 'src/user/enums/user-type.enum';
import { ROLES_KEY } from '../decorators/auth.decorator';
import { COMMON_CONSTANT } from '../constants/common.constant';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const decoded = context.switchToHttp().getRequest()[
      COMMON_CONSTANT.JWT_DECODED_REQUEST_PARAM
    ];

    if (!requiredRoles.includes(decoded.role)) {
      throw new ForbiddenException();
    }

    return true;
  }
}
