/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, Logger } from '@nestjs/common';
import { ISendMail } from '../interfaces';
import { MailerService } from '@nestjs-modules/mailer';
import { mailConfig } from '../../../config';

@Injectable()
export class MailService {

  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService
  ){}

  sendMail(params: ISendMail) {
    this.logger.log('sendMail params = ' + JSON.stringify(params));
    
    return this.mailerService.sendMail({
      subject: params.subject,
      to: params.to,
      from: params.from || mailConfig.senderEmail,
      template: params.template,
      text: params.text,
      html: params.html,
      context: params.context || {}
    }).catch(err => this.logger.warn('sendMail err: ' + err.message));
  }
}
