import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CommuneService } from './services/commune.service';
import { CommuneController } from './controllers/commune.controller';

@Module({
  imports: [AuthModule],
  providers: [CommuneService],
  controllers: [CommuneController],
  exports: [CommuneService],
})
export class CommuneModule {}
