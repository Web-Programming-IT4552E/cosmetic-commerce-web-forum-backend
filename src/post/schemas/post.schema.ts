import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { PostCategory } from '../enums/post-category.enum';
import { PostStatus } from '../enums/post-status.enum';
import { PostType } from '../enums/post-type.enum';

@modelOptions({
  options: { allowMixed: 0 },
  schemaOptions: {
    timestamps: {
      createdAt: 'create_time',
      updatedAt: 'update_time',
    },
  },
})
export class Post {
  @prop({ required: true, type: Types.ObjectId, ref: () => User })
  user_id: Ref<User>;

  @prop({ required: false, enums: PostCategory, type: String })
  category?: PostCategory;

  @prop({ required: true })
  content: string;

  @prop({ required: false })
  attachment: string[];

  @prop({ required: true, enum: PostStatus })
  status: PostStatus;

  @prop({ required: true, enum: PostType })
  type: PostType;

  @prop({ required: false, default: 0 })
  number_of_like: number;

  @prop({ required: false, default: 0 })
  number_of_comment: number;

  @prop({})
  create_time: Date;
}
