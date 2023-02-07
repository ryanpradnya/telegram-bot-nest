import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ExceptionInterceptor } from './application/interceptors/exception.interceptor';
import { configService } from './config/config.service';

async function bootstrap() {
  const version = configService.get('API_VERSION');
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalInterceptors(new ExceptionInterceptor());

  const options = new DocumentBuilder()
    .setTitle('Message Engine')
    .setDescription('Message Engine Documentation')
    .setVersion(version)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.getAppPort(), '0.0.0.0');
}
bootstrap();
