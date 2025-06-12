import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DistrictService } from './services/district.service';
import { DistrictController } from './controllers/district.controller';

@Module({
  imports: [AuthModule],
  providers: [DistrictService],
  controllers: [DistrictController],
  exports: [DistrictService],
})
export class DistrictModule {}
