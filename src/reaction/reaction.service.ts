import { Types } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { ReactionRepository } from './reaction.repository';
import {
  POST_REACTION_QUEUE,
  REACTION_TO_POST,
} from './constants/reaction.constant';

@Injectable()
export class ReactionService {
  private readonly _logger = new Logger(ReactionService.name);

  constructor(
    private readonly reactionRepository: ReactionRepository,
    @InjectQueue(POST_REACTION_QUEUE) private readonly postReactionQueue: Queue,
  ) {}

  async getObjectReactedUserList(
    reacted_object_id: string,
    limit: number,
    lastPrevReactionId: string,
  ) {
    const query = {
      reacted_object_id,
    };
    if (lastPrevReactionId) {
      Object.assign(query, {
        _id: { $gt: new Types.ObjectId(lastPrevReactionId) },
      });
    }
    const selectQuery = {};
    const sort_by = 'create_time';
    const populateOptions = [
      { path: 'user_id', select: '_id fullname avatar' },
    ];
    const data = await this.reactionRepository.getReactionList(
      limit,
      query,
      selectQuery,
      populateOptions,
      sort_by,
    );
    return [...data];
  }

  async toggleReaction(user_id: string, reacted_object_id: string) {
    try {
      await this.postReactionQueue.add(REACTION_TO_POST, {
        user_id,
        reacted_object_id,
      });
    } catch (error) {
      this._logger.error(`Error queueing toggleReaction`);
      throw error;
    }
  }

  async createReaction(user_id: string, reacted_object_id: string) {
    return this.reactionRepository.createReaction(user_id, reacted_object_id);
  }

  async deleteReaction(query: any) {
    return this.reactionRepository.findReactionAndDelete(query);
  }
}
