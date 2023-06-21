import { FactoryProvider } from '@nestjs/common';
import { getModelForClass } from '@typegoose/typegoose';
import { DATABASE_CONNECTION_NAME } from '../database/database.constants';
import { User } from './schemas/user.schema';

export const userProviders: FactoryProvider[] = [
  ...[User].map<FactoryProvider>((ModelClass) => ({
    provide: ModelClass,
    inject: [DATABASE_CONNECTION_NAME],
    useFactory: () => getModelForClass(User),
  })),
];
