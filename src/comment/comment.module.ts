import { Module } from '@nestjs/common';
import { PostModule } from 'src/post/post.module';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentRepository } from './comment.repository';
import { commentProviders } from './comment.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, PostModule],
  providers: [CommentService, CommentRepository, ...commentProviders],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
