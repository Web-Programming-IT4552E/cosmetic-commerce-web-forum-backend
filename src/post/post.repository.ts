import { FilterQuery, UpdateQuery } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateRegularPostDto } from './dtos/createRegularPost.dto';
import { Post } from './schemas/post.schema';

@Injectable()
export class PostRepository {
  constructor(
    @Inject(Post)
    private readonly postModel: ReturnModelType<typeof Post>,
  ) {}

  async getPublicPostList(
    page: number,
    limit: number,
    query: FilterQuery<Post>,
    selectQuery: any,
    populateOptions: any[],
    sortQuery: string,
  ) {
    return this.postModel
      .find(query)
      .select(selectQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate(populateOptions)
      .sort(sortQuery)
      .lean();
  }

  async getPublicPostDetail(
    query: FilterQuery<Post>,
    populateOptions: any[],
  ): Promise<Post> {
    return this.postModel.find(query).populate(populateOptions).lean();
  }

  async getNumberOfPostWithFilter(query: FilterQuery<Post>) {
    return this.postModel.countDocuments(query);
  }

  async createPost(author_id: string, createPostDto: CreateRegularPostDto) {
    return this.postModel.create({
      user_id: author_id,
      ...createPostDto,
    });
  }

  async updatePost(query: FilterQuery<Post>, updatePost: UpdateQuery<Post>) {
    return this.postModel.findOneAndUpdate(query, updatePost, {
      new: true,
    });
  }
}
