import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CommuneRepository,
  UserRepository,
  WaterAccessIndicatorRepository,
  WaterSanitationPlanRepository,
} from '@/modules/database';
import { WaterSanitationPlanEntity } from '../../database/typeorm/entities/water-sanitation-plan';
import { In } from 'typeorm';
import { PageDto } from '../../../common';
import { CreateWaterAccessIndicatorDto, UpdateWaterAccessIndicatorDto, WaterAccessIndicatorPageDto } from '../dto/waterAccessIndicator.dto';
import { WaterAccessIndicatorEntity } from '../../database/typeorm/entities/water-access-indicator';

@Injectable()
export class WaterAccessIndicatorService {
  private readonly logger = new Logger(WaterAccessIndicatorService.name);

  constructor(
    private readonly waterAccessIndicatorRepo: WaterAccessIndicatorRepository,
    private readonly waterSanitationPlanRepo: WaterSanitationPlanRepository,
    private readonly userRepo: UserRepository,
  ) {}

   async create(payload: CreateWaterAccessIndicatorDto, userId: string): Promise<WaterAccessIndicatorEntity> {
    const waterSanitationPlan = await this.waterSanitationPlanRepo.findById(payload.waterSanitationPlanId);
    if (!waterSanitationPlan) {
      throw new NotFoundException(`Water Sanitation Plan not found`);
    }

    const waterAccessIndicator = await this.waterAccessIndicatorRepo.store({
      ...payload,
      waterSanitationPlan: waterSanitationPlan,
      createdBy: userId,
    }); 

    return waterAccessIndicator;

  }

  async findAll(payload: WaterAccessIndicatorPageDto): Promise<PageDto<WaterAccessIndicatorEntity>> {
    const { limit = 10, page = 1 } = payload;
    let [waterAccessIndicators, total]: [WaterAccessIndicatorEntity[], number] = [[], 0];

    if (payload.orderField == 'waterSanitationPlan') {
      [waterAccessIndicators, total] = await this.waterAccessIndicatorRepo.findAndCount({
        take: limit,
        skip: (page - 1) * limit,
        where: {
          waterSanitationPlan: {
            id: payload.q,
          },
        },
      });
    } else {
      [waterAccessIndicators, total] = await this.waterAccessIndicatorRepo.findAndCount({
        take: limit,
        skip: (page - 1) * limit,
        order: {
          [payload.orderField]: payload.q,
        },
      });
    }

    return new PageDto<WaterAccessIndicatorEntity>(waterAccessIndicators, total);
  }

  async findOne(id: string): Promise<WaterAccessIndicatorEntity> {
    const waterAccessIndicator = await this.waterAccessIndicatorRepo.findOne({ where: { id } });
    if (!waterAccessIndicator) throw new NotFoundException('Water Access Indicator not found');
    return waterAccessIndicator;
  }

  async update(id: string, payload: UpdateWaterAccessIndicatorDto): Promise<WaterAccessIndicatorEntity> {
    const waterAccessIndicator = await this.findOne(id);

    Object.assign(waterAccessIndicator, payload);

    const waterSanitationPlan = await this.waterSanitationPlanRepo.findById(payload.waterSanitationPlanId);
    if (!waterSanitationPlan) {
      throw new NotFoundException(`Water Sanitation Plan not found`);

    }

    return this.waterAccessIndicatorRepo.save(waterAccessIndicator);
  }

  async remove(id: string): Promise<void> {
    const result = await this.waterAccessIndicatorRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Water Access Indicator not found');
  }

}
