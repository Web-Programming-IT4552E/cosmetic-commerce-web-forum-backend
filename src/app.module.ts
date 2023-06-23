import { Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import mongoose from 'mongoose';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { AdminModule } from './admin/admin.module';
import { RedisCacheModule } from './cache/redis/redis-cache.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './common/guards/auth.guard';
import { CommonModule } from './common/common.module';
import { RoleGuard } from './common/guards/roles.guard';
import { CustomerModule } from './customer/customer.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { ReactionModule } from './reaction/reaction.module';
import { QueueModule } from './queue/queue.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    AdminModule,
    QueueModule,
    RedisCacheModule,
    AuthModule,
    CustomerModule,
    CommonModule,
    PostModule,
    ReactionModule,
    CommentModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule implements OnModuleDestroy {
  async onModuleDestroy() {
    await mongoose.disconnect();
  }
}
