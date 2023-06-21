import { FactoryProvider } from '@nestjs/common';
import {
  getDiscriminatorModelForClass,
  getModelForClass,
} from '@typegoose/typegoose';
import { User } from 'src/user/schemas/user.schema';
import { UserType } from '../user/enums/user-type.enum';
import { DATABASE_CONNECTION_NAME } from '../database/database.constants';
import { Admin } from './schemas/admin.schema';

export const adminProviders: FactoryProvider[] = [
  ...[Admin].map<FactoryProvider>((ModelClass) => ({
    provide: ModelClass,
    inject: [DATABASE_CONNECTION_NAME],
    useFactory: () =>
      getDiscriminatorModelForClass(
        getModelForClass(User),
        Admin,
        UserType.ADMIN,
      ),
  })),
];
