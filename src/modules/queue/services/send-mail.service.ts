import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '../../core/services/mail.service';
import { ISendMail } from '../../core/interfaces';


@Injectable()
export class SendMailService {
  private readonly logger = new Logger(SendMailService.name);

  constructor(
    private readonly mailService: MailService  
  ) {}

  async handleSendMail(payload: ISendMail) : Promise<void> {
      await this.mailService.sendMail(payload);
  }
}
