// import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

const providers = [ConfigService];

const jwtModule = JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return {
      secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
      signOptions: {
        expiresIn: Number(
          configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
        ),
      },
    };
  },
});

@Global()
@Module({
  providers,
  imports: [jwtModule],
  exports: [...providers, jwtModule],
})
export class CommonModule {}
