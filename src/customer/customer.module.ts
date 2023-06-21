import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { customerProviders } from './customer.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, UserModule],
  providers: [...customerProviders],
})
export class CustomerModule {}
