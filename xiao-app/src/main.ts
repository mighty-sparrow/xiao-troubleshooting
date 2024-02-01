import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { fastifyMultipart } from '@fastify/multipart';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableShutdownHooks();
  app.register(fastifyMultipart);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Audio Recording API')
    .setDescription(
      'Manage audio recordings.',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  Logger.debug(
    `Startup DB Settings: mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE_RECORDINGS}`,
    AppModule.name,
  );
  await app.listen(
    process.env.PORT ? parseInt(process.env.PORT) : 3000,
    '0.0.0.0',
    (e, addr) => {
      Logger.debug(`Server is up and running at ${addr}/api`, AppModule.name);
    },
  );
}
bootstrap();
