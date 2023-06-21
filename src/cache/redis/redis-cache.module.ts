import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async (config: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: config.get<string>('REDIS_HOST'),
            port: config.get<number>('REDIS_PORT'),
          },
          ttl: 60 * 60, // 1 hour
        });
        return {
          store: store as unknown as CacheStore,
        };
      },
      inject: [ConfigService],
      isGlobal: true,
    }),
  ],
  // exports: [RedisCacheModule, CacheModule],
})
export class RedisCacheModule {}
