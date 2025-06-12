import { Module } from '@nestjs/common';
import { CoreModule } from './modules/core/core.module';
import { QueueModule } from './modules/queue/queue.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { UploadModule } from './modules/upload/upload.module';
import { ClsModule } from 'nestjs-cls';
import { WebhookModule } from './modules/webhook/webhook.module';
import { DistrictModule } from './modules/district/district.module';
import { CommuneModule } from './modules/commune/commune.module';

@Module({
  imports: [
    CoreModule,
    QueueModule,
    ScheduleModule,
    AuthModule,
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    WebhookModule,
    UserModule,
    UploadModule,
    DistrictModule,
    CommuneModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
