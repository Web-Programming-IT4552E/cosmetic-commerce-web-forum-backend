import { Inject, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(User)
    private readonly userModel: ReturnModelType<typeof User>,
  ) {}

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).lean().exec();
  }

  async getUserByEmailAlongWithPassword(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).select({
      _id: 1,
      email: 1,
      hashed_password: 1,
      type: 1,
      status: 1,
    });
  }

  async findOneUser(query: FilterQuery<User>) {
    return this.userModel.findOne(query).lean();
  }

  async findOneUserWithPassword(query: FilterQuery<User>) {
    return this.userModel
      .findOne(query)
      .select({
        _id: 1,
        email: 1,
        hashed_password: 1,
        type: 1,
        status: 1,
      })
      .lean();
  }

  async findOneUserAndUpdate(
    query: FilterQuery<User>,
    updateOptions: UpdateQuery<User>,
  ) {
    return this.userModel
      .findOneAndUpdate(query, updateOptions, { new: true })
      .lean();
  }

  async createUser(createUserDto: any) {
    return this.userModel.create({ ...createUserDto });
  }
}
