import { FactoryProvider } from '@nestjs/common';
import { getModelForClass } from '@typegoose/typegoose';
import { DATABASE_CONNECTION_NAME } from '../database/database.constants';
import { Reaction } from './schemas/reaction.schema';

export const reactionProviders: FactoryProvider[] = [
  ...[Reaction].map<FactoryProvider>((ModelClass) => ({
    provide: ModelClass,
    inject: [DATABASE_CONNECTION_NAME],
    useFactory: () => getModelForClass(ModelClass),
  })),
];
