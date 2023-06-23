import { FactoryProvider } from '@nestjs/common';
import { getModelForClass } from '@typegoose/typegoose';
import { DATABASE_CONNECTION_NAME } from '../database/database.constants';
import { Comment } from './schemas/comment.schema';

export const commentProviders: FactoryProvider[] = [
  ...[Comment].map<FactoryProvider>((ModelClass) => ({
    provide: ModelClass,
    inject: [DATABASE_CONNECTION_NAME],
    useFactory: () => getModelForClass(ModelClass),
  })),
];
