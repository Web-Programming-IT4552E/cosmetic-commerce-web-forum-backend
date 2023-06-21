import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import { ConfigInterface } from '../config/config.interface';
import { DATABASE_CONNECTION_NAME } from './database.constants';

export const databaseProviders: FactoryProvider[] = [
  {
    provide: DATABASE_CONNECTION_NAME,
    inject: [ConfigService],
    useFactory: async (
      configService: ConfigService<ConfigInterface>,
    ): Promise<typeof mongoose> =>
      mongoose.connect(configService.get('MONGODB_CONN_STRING') || '', {
        connectTimeoutMS: 10_000,
      }),
  },
];
