import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from './user.providers';
import { UserAccountService } from './user-account.service';
import { UserRepository } from './user.repository';

@Module({
  imports: [DatabaseModule],
  providers: [...userProviders, UserAccountService, UserRepository],
  exports: [UserAccountService],
})
export class UserModule {}
