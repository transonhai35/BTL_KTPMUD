import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CommuneRepository,
  UserRepository,
  WaterSanitationPlanRepository,
} from '@/modules/database';
import { CreateWaterSanitationPlanDto, UpdateWaterSanitationPlanDto } from '../dto/waterSanitationPlan.dto';
import { WaterSanitationPlanEntity } from '../../database/typeorm/entities/water-sanitation-plan';
import { In } from 'typeorm';

@Injectable()
export class WaterSanitationPlanService {
  private readonly logger = new Logger(WaterSanitationPlanService.name);

  constructor(
    private readonly WaterSanitationPlanRepo: WaterSanitationPlanRepository,
    private readonly communeRepo: CommuneRepository,
    private readonly userRepo: UserRepository,
  ) {}

   async create(payload: CreateWaterSanitationPlanDto, userId: string): Promise<WaterSanitationPlanEntity> {
    const commune = await this.communeRepo.findById(payload.communeId);
    if (!commune) {
      throw new NotFoundException(`Commune not found`);
    }

    if (payload.assign?.length) {
      const existingUsers = await this.userRepo.findBy({
        id: In(payload.assign),
      });

      const existingUserIds = existingUsers.map(user => user.id);
      const invalidUserIds = payload.assign.filter(id => !existingUserIds.includes(id));

      if (invalidUserIds.length > 0) {
        throw new NotFoundException(`UserNot Found: ${invalidUserIds.join(', ')}`);
      }
    }

    const waterSanitationPlan = await this.WaterSanitationPlanRepo.store({
      ...payload,
      commune: commune,
      createdBy: userId,
    });

    return waterSanitationPlan;

  }

  async findAll(): Promise<WaterSanitationPlanEntity[]> {
    const waterSanitationPlans = await this.WaterSanitationPlanRepo.find();
    return waterSanitationPlans;
  }

  async findOne(id: string): Promise<WaterSanitationPlanEntity> {
    const waterSanitationPlan = await this.WaterSanitationPlanRepo.findOne({ where: { id } });
    if (!waterSanitationPlan) throw new NotFoundException('Water Sanitation Plan not found');
    return waterSanitationPlan;
  }

  async update(id: string, payload: UpdateWaterSanitationPlanDto): Promise<WaterSanitationPlanEntity> {
    const waterSanitationPlan = await this.findOne(id);

    Object.assign(waterSanitationPlan, payload);

    if (payload.assign?.length) {
      const existingUsers = await this.userRepo.findBy({
        id: In(payload.assign),
      });

      const existingUserIds = existingUsers.map(user => user.id);
      const invalidUserIds = payload.assign.filter(id => !existingUserIds.includes(id));

      if (invalidUserIds.length > 0) {
        throw new NotFoundException(`UserNot Found: ${invalidUserIds.join(', ')}`);
      }

      waterSanitationPlan.assign = payload.assign;
    }

    if (payload.communeId) {
      const commune = await this.communeRepo.findById(payload.communeId);
      if (!commune) {
        throw new NotFoundException('Commune not found');
      }
      waterSanitationPlan.commune = commune;
    }

    return await this.WaterSanitationPlanRepo.save(waterSanitationPlan);
  }

  async remove(id: string): Promise<void> {
    const result = await this.WaterSanitationPlanRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Water Sanitation Plan not found');
  }

}
