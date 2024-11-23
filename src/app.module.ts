import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImouModule } from './imou/imou.module';
import { ConfigModule } from '@nestjs/config';
import { AppLoggerMiddleware } from './_middlewares/app-logger.middleware';

@Module({
  imports: [ConfigModule.forRoot(), ImouModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
