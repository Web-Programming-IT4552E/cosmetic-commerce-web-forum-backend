import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from './user.providers';
import { UserAccountService } from './user-account.service';
import { UserRepository } from './user.repository';
import { UserAccountController } from './user-account.controller';

@Module({
  imports: [DatabaseModule],
  providers: [...userProviders, UserAccountService, UserRepository],
  controllers: [UserAccountController],
  exports: [UserAccountService],
})
export class UserModule {}
