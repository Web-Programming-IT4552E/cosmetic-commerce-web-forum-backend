import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { postProviders } from './post.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PostService, PostRepository, ...postProviders],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
