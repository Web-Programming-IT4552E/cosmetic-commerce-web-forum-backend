import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { adminProviders } from './admin.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, UserModule],
  providers: [...adminProviders],
})
export class AdminModule {}
