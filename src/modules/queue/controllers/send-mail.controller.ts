/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { sendMailQueueConfig } from '@/config';
import { SendMailService } from '../services/send-mail.service';

@Controller()
export class SendMailController {
  private readonly logger = new Logger(SendMailController.name);

  constructor(private readonly sendMailService: SendMailService) {}

  /**
   * Handles incoming send mail events.
   * This endpoint listens to events from the configured send mail queue topic
   * and triggers the send mail service to process the provided payload.
   */
  @EventPattern(sendMailQueueConfig.topic)
  sendMail(@Payload() payload: any) {
    this.logger.log('sendMail payload: ' + JSON.stringify(payload));
    this.sendMailService.handleSendMail(payload);
  }
}
