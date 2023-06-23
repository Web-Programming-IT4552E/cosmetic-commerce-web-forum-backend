import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { PostModule } from 'src/post/post.module';
import { ReactionService } from './reaction.service';
import { ReactionController } from './reaction.controller';
import { ReactionRepository } from './reaction.repository';
import { reactionProviders } from './reaction.providers';
import { DatabaseModule } from '../database/database.module';
import { POST_REACTION_QUEUE } from './constants/reaction.constant';
import { ReactionProcessor } from './reaction.queue.processor';

@Module({
  imports: [
    DatabaseModule,
    BullModule.registerQueueAsync({
      name: POST_REACTION_QUEUE,
      useFactory: (configService: ConfigService) => ({
        // TODO : can replace this by developing a middleware to automate prepend a prefix to all logs to Redis
        name: `${configService.get<string>('APP_NAME')}:${POST_REACTION_QUEUE}`,
      }),
      inject: [ConfigService],
    }),
    PostModule,
  ],
  providers: [
    ReactionProcessor,
    ReactionService,
    ReactionRepository,
    ...reactionProviders,
  ],
  controllers: [ReactionController],
  exports: [ReactionService],
})
export class ReactionModule {}
