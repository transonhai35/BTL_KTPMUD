import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WaterSanitationPlanService } from './services/waterSanitationPlan.service';
import { WaterSanitationPlanController } from './controllers/waterSanitationPlan.controller';

@Module({
  imports: [AuthModule],
  providers: [WaterSanitationPlanService],
  controllers: [WaterSanitationPlanController],
  exports: [WaterSanitationPlanService],
})
export class WaterSanitationPlanModule {}
