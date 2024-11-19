import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ImouService } from './imou.service';

@Module({
  imports: [HttpModule],
  providers: [ImouService],
  exports: [ImouService],
})
export class ImouModule {}
