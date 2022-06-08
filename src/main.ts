import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('NestApplication');

  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get<string>('PORT') || 3000;
  if (port == 3000) {
    logger.warn('PORT is not set in .env file, using default port 3000 instead');
  }
  if (!port) {
    logger.error('PORT is not defined in the .env file!');
    return;
  }
  if (isNaN(+port)) {
    logger.error('PORT is not a valid number!');
    return;
  }

  await app.listen(port).then(() => {
    logger.log(`Application is running on http://localhost:${port}`);
    logger.log(`View API Docs on http://localhost:${port}/api`);
  });
}
bootstrap();
