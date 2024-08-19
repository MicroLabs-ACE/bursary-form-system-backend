import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import secureSession from '@fastify/secure-session';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: true },
  );

  const configService = app.get(ConfigService);

  await app.register(secureSession, {
    secret: configService.get<string>('SESSION_SECRET'),
    salt: configService.get<string>('SESSION_SALT'),
    cookie: {
      path: '/',
      maxAge: 24 * 60 * 60,
    },
  });

  const config = new DocumentBuilder()
    .setTitle('Bursary Form Service')
    .setDescription('The Bursay Forms Service API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
