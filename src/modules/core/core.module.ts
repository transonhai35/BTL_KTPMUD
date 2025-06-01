/*
https://docs.nestjs.com/modules
*/

import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CacheModule } from '../cache';
import { MailerModule } from '@nestjs-modules/mailer';
import { cacheConfig, mailConfig } from '../../config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { KafkaClientService } from './services/kafka-client.service';
import { MailService } from './services/mail.service';

const services = [
    KafkaClientService,
    MailService,
];

@Global()
@Module({
    imports: [
        DatabaseModule,
        CacheModule.register({
            max: cacheConfig.max,
            ttl: cacheConfig.ttl
        }),
        MailerModule.forRoot({
            transport: {
                service: mailConfig.transport.service,
                host: mailConfig.transport.host,
                port: mailConfig.transport.port,
                auth: {
                    user: mailConfig.transport.user,
                    pass: mailConfig.transport.pass
                },
                secure: mailConfig.transport.secure,
                ignoreTLS: !mailConfig.transport.secure
            },
            defaults: {
                from: mailConfig.senderEmail
            },
            preview: false,
            template: {
                dir: mailConfig.templateDir,
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
            options: {
                partials: {
                    dir: mailConfig.templateDir + '/partials',
                    options: {
                        strict: true,
                    },
                },
            },
        }),
    ],
    controllers: [],
    providers: [
        ...services
    ],
    exports: [
        ...services
    ]
})
export class CoreModule { }
