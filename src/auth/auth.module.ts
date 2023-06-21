import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { RedisCacheModule } from 'src/cache/redis/redis-cache.module';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [DatabaseModule, UserModule, RedisCacheModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
