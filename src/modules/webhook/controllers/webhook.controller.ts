/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
} from '@nestjs/common';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { KafkaClientService } from '../../core/services/kafka-client.service';
import { PlaidWebhookBody } from '../interfaces/plaid-webhook';
import { plaidWebhookQueueConfig } from '@/config';

@ApiExcludeController()
@ApiTags('webhook')
@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);
  constructor(private readonly kafkaClientService: KafkaClientService) {}
  @Post('plaid')
  async handlePlaidWebhook(@Body() payload: PlaidWebhookBody): Promise<void> {
    const {
      webhook_type: webhookType,
      webhook_code: webhookCode,
      item_id: itemId,
    } = payload;

    this.logger.log(
      `Received Plaid webhook: ${webhookType} - ${webhookCode}`,
      JSON.stringify(payload),
    );

    if (!itemId) {
      throw new BadRequestException('Missing item_id in webhook payload');
    }

    await this.kafkaClientService
      .emit(plaidWebhookQueueConfig.topic, payload)
      .catch((err) =>
        this.logger.error('Plaid Webhook Kafka emit error: ' + err.message),
      );
  }
}
