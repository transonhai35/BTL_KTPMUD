/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { WebhookController } from './controllers/webhook.controller';
@Module({
  controllers: [WebhookController],
  providers: [],
})
export class WebhookModule {}
