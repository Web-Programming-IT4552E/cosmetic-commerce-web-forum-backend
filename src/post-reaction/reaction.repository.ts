import { FilterQuery } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Reaction } from './schemas/reaction.schema';

@Injectable()
export class ReactionRepository {
  constructor(
    @Inject(Reaction)
    private readonly reactionModel: ReturnModelType<typeof Reaction>,
  ) {}

  async getReactionList(
    limit: number,
    query: FilterQuery<Reaction>,
    selectQuery: any,
    populateOptions: any[],
    sortQuery: string,
  ) {
    return this.reactionModel
      .find(query)
      .select(selectQuery)
      .limit(limit)
      .populate(populateOptions)
      .sort(sortQuery)
      .lean();
  }

  async getNumberOfReactionWithFilter(query: FilterQuery<Reaction>) {
    return this.reactionModel.countDocuments(query);
  }

  async findReactionAndDelete(query: FilterQuery<Reaction>) {
    return this.reactionModel.findOneAndDelete(query);
  }

  async createReaction(user_id: string, reacted_object_id: string) {
    return this.reactionModel.create({
      user_id,
      reacted_object_id,
    });
  }
}
