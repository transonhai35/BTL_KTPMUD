/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { SendMailService } from './services/send-mail.service';
import { SendMailController } from './controllers/send-mail.controller';
import { CoreModule } from '../core/core.module';

const services = [SendMailService];
@Module({
  imports: [CoreModule],
  controllers: [SendMailController],
  providers: [...services],
})
export class QueueModule {}
