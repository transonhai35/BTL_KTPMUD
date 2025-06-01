/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { ScheduleService } from './services/schedule.service';

@Module({
    imports: [
        CoreModule,
        NestScheduleModule.forRoot(),
    ],
    controllers: [],
    providers: [
        ScheduleService,
    ],
})
export class ScheduleModule {}
