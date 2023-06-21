import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { getEnumValues } from '../../common/utils/enum-utils';
import { UserStatus } from '../enums/user-status.enum';
import { UserType } from '../enums/user-type.enum';

@modelOptions({
  schemaOptions: {
    timestamps: {
      createdAt: 'created_time',
      updatedAt: 'updated_time',
    },
    discriminatorKey: 'type',
  },
})
export class User {
  /**
   * User ID
   *
   * @example 6280c1a3e549df4140f20356
   */
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  /**
   * User's email:
   *
   * @example user.example@gmail.com
   */
  @prop({ required: true, unique: true })
  email: string;

  /**
   * user fullname
   *
   * @example Gill Rick
   */
  @prop()
  fullname: string;

  /**
   * user phonenumber
   *
   * @example +8401293981203
   */
  @prop({ require: false })
  phone: string;

  /**
   * User status:
   *
   * 0: newly-created, need to be activated
   *
   * 1: active
   *
   * 2: inactive
   *
   * @example 0
   */
  @ApiProperty({ type: UserStatus, enum: getEnumValues(UserStatus) })
  @prop({ enum: getEnumValues(UserStatus) })
  status: UserStatus;

  /**
   * User status:
   *
   * 0: newly-created, need to be activated
   *
   * 1: active
   *
   * 2: inactive
   *
   * @example 0
   */
  @ApiProperty({ type: UserType, enum: getEnumValues(UserType) })
  @prop({ enum: getEnumValues(UserType) })
  type: UserType;

  /**
   * User image URL
   *
   * @example https://fimgs.net/mdimg/perfume/375x500.59009.jpg
   */
  @prop()
  avatar: string;

  /**
   * user hashed_password, using low-speed hashing algorithm
   * @example $2b$10$d20934ulksdhfy8oakjn421MOr1K779YyW8a6u0bLxly
   */
  @ApiHideProperty()
  @prop({ required: true, select: false })
  hashed_password: string;

  /**
   * flag to indicate that user has been deleted or not
   * deleted user won't be recovered using app logic
   * but still has a record on database
   * @example false
   */
  @prop({ required: true })
  del_flag: boolean;

  /**
   * user active_token, generated when user activate account or
   * using forgot password API to reset password
   */
  @prop({ required: true })
  active_token: string;

  /**
   * Mongoose's internal versionKey property, excluded in query result
   *
   * @see https://mongoosejs.com/docs/guide.html#versionKey
   */
  @ApiHideProperty()
  @prop({ select: false })
  __v?: number;
}
