import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WaterAccessIndicatorService } from './services/waterAccessIndicator.service';
import { WaterAccessIndicatorController } from './controllers/waterAccessIndicator.controller';

@Module({
  imports: [AuthModule],
  providers: [WaterAccessIndicatorService],
  controllers: [WaterAccessIndicatorController],
  exports: [WaterAccessIndicatorService],
})
export class WaterAccessIndicatorModule {}
