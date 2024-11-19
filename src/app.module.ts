import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImouModule } from './imou/imou.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), ImouModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
