import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: ['Content-Type', 'X-Access-Token', 'X-Refresh-Token'],
  });
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('Bursary Form Service')
    .setDescription('The Bursary Forms Service API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(configService.get<number>('PORT') || 3000);
}
bootstrap();
