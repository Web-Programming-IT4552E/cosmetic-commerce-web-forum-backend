import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserAccountService {
  constructor(private readonly userAccountRepository: UserRepository) {}

  async getCurrentUserAccountInformation(email: string) {
    return this.userAccountRepository.getUserByEmail(email);
  }

  async getUserByEmailAlongWithPassword(email: string) {
    return this.userAccountRepository.getUserByEmailAlongWithPassword(email);
  }
}
