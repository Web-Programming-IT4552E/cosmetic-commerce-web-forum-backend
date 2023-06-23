import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { Post } from '../../post/schemas/post.schema';
import { User } from '../../user/schemas/user.schema';
import { CommentStatus } from '../enums/comment-status.enum';

@modelOptions({
  options: { allowMixed: 0 },
  schemaOptions: {
    timestamps: {
      createdAt: 'created_time',
      updatedAt: 'updated_time',
    },
  },
})
export class Comment {
  @prop({ required: true, type: Types.ObjectId, ref: () => User })
  user_id: Ref<User>;

  @prop({ required: true, type: Types.ObjectId, ref: () => Post })
  post_id: Ref<Post>;

  @prop({ required: false, type: Types.ObjectId, ref: () => Comment })
  reply_to_comment_id: Ref<Comment>;

  @prop({ required: true })
  content: string;

  @prop({ required: false })
  attachment: string[];

  @prop({ required: true, enum: CommentStatus })
  status: CommentStatus;

  @prop({ required: false, default: 0 })
  number_of_like: number;

  @prop({ required: false, default: 0 })
  number_of_reply: number;
}
