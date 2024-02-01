import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoConfig from './config/mongoConfig';
import { MFileModule } from './api/mfile/mfile.module';
import { HelloWorldModule } from './api/hello-world/hello-world.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AudioTranslationService } from './tasks/audio.translation.service';
import { AppLoggerMiddleware } from './shared/logging/app.logger.middleware';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `${__dirname}/config/.env.${process.env.NODE_ENV}`,
        `${__dirname}/config/.env`,
      ],
      load: [mongoConfig],
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`,
      {
        connectionName: 'cxnRecordings',
        dbName: process.env.MONGO_DATABASE_RECORDINGS,
      },
    ),
    HelloWorldModule,
    MFileModule,
  ],
  controllers: [],
  providers: [AudioTranslationService],
})
// export class AppModule {}
/**
 * Alternatively, if you want som verbose output...
 */
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
