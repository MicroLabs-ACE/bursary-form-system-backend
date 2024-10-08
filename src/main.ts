import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://bursary-form-system-frontend.onrender.com',
    ],
    credentials: true,
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
