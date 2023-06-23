/* eslint-disable no-restricted-syntax */
import { JwtPayload } from 'src/auth/dtos/jwt-payload.dto';
import { Injectable } from '@nestjs/common';
import { CreateAnnouncementPostDto } from './dtos/createAnnouncementPost.dtos';
import { CreateRegularPostDto } from './dtos/createRegularPost.dto';
import { UpdatePostDto } from './dtos/updatePost.dto';
import { PostStatus } from './enums/post-status.enum';
import { PostType } from './enums/post-type.enum';
import { PostRepository } from './post.repository';
import { GetListPublicPostQueryDto } from './enums/getListPublicPostQuery.dto';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async getPublicPost(
    getListPublicPostQueryDto: GetListPublicPostQueryDto,
    user: JwtPayload,
  ) {
    const { page, limit, category, status, author_id } = {
      ...getListPublicPostQueryDto,
    };
    const query = {};

    const selectQuery = {};
    const sort_by = '-create_time';
    if (category) {
      Object.assign(query, { category: { $in: category.split(',') } });
    }
    if (author_id) {
      Object.assign(query, { user_id: { $in: author_id.split(',') } });
    }
    if (user.role === 'customer') {
      Object.assign(query, {
        status: { $in: [PostStatus.ACTIVE, PostStatus.LOCKED] },
      });
    }
    if (status && user.role === 'admin') {
      Object.assign(query, {
        $and: [
          { status: { $in: status.split(',').map((x) => +x) } },
          { status: { $not: { $eq: PostStatus.DELETED } } },
        ],
      });
    }
    const populateOptions = [
      { path: 'user_id', select: '_id fullname avatar email' },
    ];
    const total = await this.postRepository.getNumberOfPostWithFilter(query);
    const data = await this.postRepository.getPublicPostList(
      page,
      limit,
      query,
      selectQuery,
      populateOptions,
      sort_by,
    );
    // for (const x of data) {
    //   if (
    //     await ReactionModel.findOne({
    //       reacted_object_id: x._id,
    //       user_id: user._id,
    //     })
    //   )
    //     Object.assign(x, { is_reacted: true });
    //   else {
    //     Object.assign(x, { is_reacted: false });
    //   }
    // }
    return {
      paginationInfo: {
        page,
        limit,
        total,
      },
      data,
    };
  }

  async getPublicPostDetail(post_id: string) {
    const query = {
      _id: post_id,
      status: { $in: [PostStatus.ACTIVE, PostStatus.LOCKED] },
    };
    const populateOptions = [
      { path: 'user_id', select: '_id fullname avatar email' },
    ];
    return this.postRepository.getPublicPostDetail(query, populateOptions);
  }

  async getMyPosts(
    user_id: string,
    page: number,
    limit: number,
    status: string,
  ) {
    const query = { user_id, status: { $not: { $eq: PostStatus.DELETED } } };
    const selectQuery = {};
    const sort_by = '-create_time';
    if (status) {
      Object.assign(query, {
        status: {
          $in: status.split(',').map((x) => {
            return x !== PostStatus.DELETED.toString() ? +x : null;
          }),
        },
      });
    }
    const populateOptions = [
      { path: 'user_id', select: '_id fullname avatar email' },
    ];
    const total = await this.postRepository.getNumberOfPostWithFilter(query);
    const data = await this.postRepository.getPublicPostList(
      page,
      limit,
      query,
      selectQuery,
      populateOptions,
      sort_by,
    );
    return {
      paginationInfo: {
        page,
        limit,
        total,
      },
      data,
    };
  }

  async getMyPostDetail(user_id: string, post_id: string) {
    const query = {
      _id: post_id,
      user_id,
      status: { $not: { $eq: PostStatus.DELETED } },
    };
    const populateOptions = [];
    return this.postRepository.getPublicPostDetail(query, populateOptions);
  }

  async createRegularPost(
    admin_id: string,
    createPostDto: CreateRegularPostDto,
  ) {
    Object.assign(createPostDto, {
      status: PostStatus.NEW,
      type: PostType.COMMON,
    });
    return this.postRepository.createPost(admin_id, createPostDto);
  }

  async createAnnouncementPost(
    admin_id: string,
    createAnnouncementPostDto: CreateAnnouncementPostDto,
  ) {
    Object.assign(createAnnouncementPostDto, {
      status: PostStatus.ACTIVE,
      type: PostType.ADMIN_ONLY,
    });
    return this.postRepository.createPost(admin_id, createAnnouncementPostDto);
  }

  async updateOfficialPost(
    author_id: string,
    post_id: string,
    updatePostDto: UpdatePostDto,
  ) {
    const query = {
      _id: post_id,
      user_id: author_id,
      status: { $nin: [PostStatus.DELETED, PostStatus.LOCKED] },
    };
    return this.postRepository.updatePost(query, updatePostDto);
  }

  async deletePost(admin_id: string, post_id: string) {
    const query = {
      _id: post_id,
      user_id: admin_id,
      status: { $not: { $eq: PostStatus.DELETED } },
    };
    const updateOptions = { status: PostStatus.DELETED };
    return this.postRepository.updatePost(query, updateOptions);
  }

  async lockPostComment(admin_id: string, post_id: string) {
    const query = {
      _id: post_id,
      user_id: admin_id,
      status: { $not: { $eq: PostStatus.DELETED } },
    };
    const updateOptions = { status: PostStatus.LOCKED };
    return this.postRepository.updatePost(query, updateOptions);
  }

  async approveAndDenyPost(post_id: string, new_status: number) {
    const query = {
      _id: post_id,
      status: { $not: { $eq: PostStatus.DELETED } },
    };
    const updateOptions = { status: new_status };
    return this.postRepository.updatePost(query, updateOptions);
  }
}
