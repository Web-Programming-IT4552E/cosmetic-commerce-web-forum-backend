import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  JwtDecodedData,
  Public,
  Roles,
} from 'src/common/decorators/auth.decorator';
import { UserType } from 'src/user/enums/user-type.enum';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dtos/login-request.dto';
import { JwtPayload } from './dtos/jwt-payload.dto';
import { RefreshTokenRequestDto } from './dtos/refresh-token.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Public()
  async login(@Body() loginRequestDto: LoginRequestDto) {
    return this.authService.login(loginRequestDto);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @Public()
  refreshToken(@Body() refreshTokenRequestDto: RefreshTokenRequestDto) {
    return this.authService.refreshToken(
      refreshTokenRequestDto.accessToken,
      refreshTokenRequestDto.refreshToken,
    );
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles([UserType.ADMIN])
  @Post('logout')
  async logout(@Req() req: any, @JwtDecodedData() data: JwtPayload) {
    const token = req.headers.authorization.split(' ')[1];
    const logoutResult = await this.authService.logout(token, data.userId);

    return {
      logoutResult,
    };
  }
}
