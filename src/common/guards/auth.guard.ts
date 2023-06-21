import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { JwtPayload } from 'src/auth/dtos/jwt-payload.dto';
import { IS_PUBLIC } from 'src/common/decorators/auth.decorator';
import { RedisCache } from 'cache-manager-redis-yet';
import { ConfigService } from '@nestjs/config';
import { COMMON_CONSTANT } from '../constants/common.constant';
import { CACHE_CONSTANT } from '../constants/cache.constant';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: RedisCache,
  ) {}

  private extractTokenFromHeader(request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (isPublic) {
        return true;
      }

      const request = context.switchToHttp().getRequest();

      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException();
      }

      const payload: JwtPayload = await this.jwtService.verifyAsync(token);

      const signature = token.split('.')[2];

      const isExistSignature = await this.cacheManager.store.client.hExists(
        `${this.configService.get('APP_NAME')}${CACHE_CONSTANT.SESSION_PREFIX}${
          payload.userId
        }`,
        signature,
      );
      if (!isExistSignature) {
        throw new UnauthorizedException();
      }

      request[COMMON_CONSTANT.JWT_DECODED_REQUEST_PARAM] = payload;

      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      throw new UnauthorizedException();
    }
  }
}
