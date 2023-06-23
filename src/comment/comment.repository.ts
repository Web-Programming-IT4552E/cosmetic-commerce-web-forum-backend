import { FilterQuery, UpdateQuery } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateCommentDto } from './dtos/createComment.dto';
import { Comment } from './schemas/comment.schema';

@Injectable()
export class CommentRepository {
  constructor(
    @Inject(Comment)
    private readonly commentModel: ReturnModelType<typeof Comment>,
  ) {}

  async getCommentList(
    limit: number,
    query: FilterQuery<Comment>,
    selectQuery: any,
    populateOptions: any[],
    sortQuery: string,
  ) {
    return this.commentModel
      .find(query)
      .select(selectQuery)
      .limit(limit)
      .populate(populateOptions)
      .sort(sortQuery)
      .lean();
  }

  async getNumberOfCommentWithFilter(query: FilterQuery<Comment>) {
    return this.commentModel.countDocuments(query);
  }

  async createComment(author_id: string, createCommentDto: CreateCommentDto) {
    return this.commentModel.create({
      user_id: author_id,
      ...createCommentDto,
    });
  }

  async updateComment(
    query: FilterQuery<Comment>,
    updateComment: UpdateQuery<Comment>,
  ) {
    return this.commentModel.findOneAndUpdate(query, updateComment, {
      new: true,
    });
  }
}
