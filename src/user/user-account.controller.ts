import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtDecodedData } from 'src/common/decorators/auth.decorator';
import { JwtPayload } from 'src/auth/dtos/jwt-payload.dto';
import { UserAccountService } from './user-account.service';

@ApiTags('account')
@Controller('account')
export class UserAccountController {
  constructor(private readonly userAccountService: UserAccountService) {}

  @ApiBearerAuth()
  @ApiOperation({ description: 'Get current user account' })
  @Get('')
  async getCurrentUserAccountInformations(@JwtDecodedData() data: JwtPayload) {
    return this.userAccountService.getCurrentUserAccountInformation(data.email);
  }
}
