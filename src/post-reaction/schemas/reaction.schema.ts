import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

@modelOptions({
  options: { allowMixed: 0 },
  schemaOptions: {
    timestamps: {
      createdAt: 'created_time',
      updatedAt: 'updated_time',
    },
  },
})
export class Reaction {
  @prop({ required: true, type: Types.ObjectId, ref: () => User })
  user_id: Ref<User>;

  @prop({ required: true, type: Types.ObjectId })
  reacted_object_id: Types.ObjectId;
}
