import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator, SetMetadata } from '@nestjs/common';
import { COMMON_CONSTANT } from 'src/common/constants/common.constant';
import type { UserType } from 'src/user/enums/user-type.enum';
import type { JwtPayload } from 'src/auth/dtos/jwt-payload.dto';

export const IS_PUBLIC = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC, true);

export const ROLES_KEY = 'roles';
export const Roles = (roles: UserType[]) => SetMetadata(ROLES_KEY, roles);

export const JwtDecodedData = createParamDecorator(
  (data: string, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest();

    return request[COMMON_CONSTANT.JWT_DECODED_REQUEST_PARAM];
  },
);
