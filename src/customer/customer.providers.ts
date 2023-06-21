import { FactoryProvider } from '@nestjs/common';
import {
  getDiscriminatorModelForClass,
  getModelForClass,
} from '@typegoose/typegoose';
import { User } from 'src/user/schemas/user.schema';
import { UserType } from '../user/enums/user-type.enum';
import { DATABASE_CONNECTION_NAME } from '../database/database.constants';
import { Customer } from './schemas/customer.schema';

export const customerProviders: FactoryProvider[] = [
  ...[Customer].map<FactoryProvider>((ModelClass) => ({
    provide: ModelClass,
    inject: [DATABASE_CONNECTION_NAME],
    useFactory: () =>
      getDiscriminatorModelForClass(
        getModelForClass(User),
        Customer,
        UserType.CUSTOMER,
      ),
  })),
];
