/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { kafkaConfig } from '@/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class KafkaClientService implements OnModuleInit {

  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: kafkaConfig.clientId,
        brokers: kafkaConfig.brokers,
        sasl: kafkaConfig.kafkaSaslEnabled? {
          mechanism: kafkaConfig.sasl.mechanism,
          username:  kafkaConfig.sasl.username,
          password: kafkaConfig.sasl.password
        } as any : undefined
      },
      producerOnlyMode: true
    }
  })
  client: ClientKafka;

  async onModuleInit() {
    await this.client.connect();
  }

  async send<TResult = any, TInput = any>(pattern: any, data: TInput): Promise<TResult> {
    return lastValueFrom(this.client.send(pattern, data));
  }

  async emit<TResult = any, TInput = any>(pattern: any, data: TInput): Promise<TResult> {
    return lastValueFrom(this.client.emit(pattern, data));
  }

  async subscribeToResponseOf(pattern: any) {
    return this.client.subscribeToResponseOf(pattern);
  }
}
