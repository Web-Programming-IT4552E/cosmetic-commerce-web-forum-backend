import {
  Processor,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
} from '@nestjs/bull';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PostService } from 'src/post/post.service';
import { PostStatus } from 'src/post/enums/post-status.enum';
import {
  POST_REACTION_QUEUE,
  REACTION_TO_POST,
} from './constants/reaction.constant';
import { ReactionService } from './reaction.service';

@Injectable()
@Processor(POST_REACTION_QUEUE)
export class ReactionProcessor {
  private readonly logger = new Logger(ReactionProcessor.name);

  constructor(
    private readonly reactionService: ReactionService,
    private readonly postService: PostService,
  ) {}

  @OnQueueActive()
  public onActive(job: Job) {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  public onComplete(job: Job) {
    this.logger.debug(`Completed job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  public onError(job: Job<any>, error: any) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Process(REACTION_TO_POST)
  public async reactionToPost(
    job: Job<{ user_id: string; reacted_object_id: string }>,
  ): Promise<void> {
    try {
      const { data } = job;
      const { user_id, reacted_object_id } = data;
      this.logger.log(
        `Processing reacted to post ${reacted_object_id} by ${user_id}`,
      );

      if (
        await this.reactionService.deleteReaction({
          reacted_object_id,
          user_id,
        })
      ) {
        await this.postService.findAPostUpdate(
          {
            _id: reacted_object_id,
            status: { $in: [PostStatus.ACTIVE, PostStatus.LOCKED] },
          },
          { $inc: { number_of_like: -1 } },
        );
        // await CommentModel.findOneAndUpdate(
        //   { _id: reacted_object_id, status: CommentStatus.ACTIVE },
        //   { $inc: { number_of_like: -1 } },
        // );
      } else {
        if (
          !(await this.postService.findAPostUpdate(
            {
              _id: reacted_object_id,
              status: { $in: [PostStatus.ACTIVE, PostStatus.LOCKED] },
            },
            { $inc: { number_of_like: 1 } },
          ))
          //  &&
          // !(await CommentModel.findOneAndUpdate(
          //   { _id: reacted_object_id, status: CommentStatus.ACTIVE },
          //   { $inc: { number_of_like: 1 } },
          // ))
        )
          throw new BadRequestException('Cannot reaction this post !');
        await this.reactionService.createReaction(user_id, reacted_object_id);
      }
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
