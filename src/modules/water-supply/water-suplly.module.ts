import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WaterSupplyService } from './services/waterSuplly.service';
import { WaterSupplyController } from './controllers/waterSuplly.controller';

@Module({
  imports: [AuthModule],
  providers: [WaterSupplyService],
  controllers: [WaterSupplyController],
  exports: [WaterSupplyService],
})
export class WaterSupplyModule {}
