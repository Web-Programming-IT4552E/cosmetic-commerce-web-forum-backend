import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ConfigInterface } from './config/config.interface';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const configService: ConfigService<ConfigInterface> = app.get(ConfigService);
  const logger = new Logger(configService.get('APP_NAME'));
  const env = configService.get('NODE_ENV') || 'development';
  if (env !== 'production') app.enableCors();

  app.enableShutdownHooks();

  const isSwaggerEnabled =
    `${configService.get('SWAGGER_ENABLED') || ''}`.toUpperCase() === 'TRUE';

  if (isSwaggerEnabled) {
    const documentBuilder = new DocumentBuilder()
      .setTitle(configService.get('SWAGGER_TITLE') || 'Title')
      .setDescription(configService.get('SWAGGER_DESCRIPTION') || 'Description')
      .setVersion(configService.get('SWAGGER_SET_VERSION') || '1.0')
      .addBearerAuth();

    const serverUrl = configService.get<string>('SWAGGER_TARGET_SERVER_URL');
    if (serverUrl) documentBuilder.addServer(serverUrl);

    const document = SwaggerModule.createDocument(app, documentBuilder.build());
    const endpoint = configService.get('SWAGGER_ENDPOINT') || 'docs';
    SwaggerModule.setup(endpoint, app, document);
    logger.log(`Swagger API serving at /${endpoint}`);
  }

  await app.listen(+(configService.get('PORT') || '3000'));
}
bootstrap();
