import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CommuneRepository,
  UserRepository,
  WaterSupplyRepository,
} from '@/modules/database';
import { WaterSanitationPlanEntity } from '../../database/typeorm/entities/water-sanitation-plan';
import { In } from 'typeorm';
import { CreateWaterSupplyDto, UpdateWaterSupplyDto } from '../dto/waterSuplly.dto';
import { WaterSupplyEntity } from '../../database/typeorm/entities/water-supply';

@Injectable()
export class WaterSupplyService {
  private readonly logger = new Logger(WaterSupplyService.name);

  constructor(
    private readonly WaterSupplyRepo: WaterSupplyRepository,
    private readonly userRepo: UserRepository,

  ) {}

   async create(payload: CreateWaterSupplyDto, userId: string): Promise<WaterSupplyEntity> {
    if (payload.owner?.length) {
      const existingUsers = await this.userRepo.findBy({
        id: In(payload.owner),
      });

      const existingUserIds = existingUsers.map(user => user.id);
      const invalidUserIds = payload.owner.filter(id => !existingUserIds.includes(id));

      if (invalidUserIds.length > 0) {
        throw new NotFoundException(`UserNot Found: ${invalidUserIds.join(', ')}`);
      }
    }

    const waterSupply = await this.WaterSupplyRepo.store({
      ...payload,
    });

    return waterSupply;

  }

  async findAll(): Promise<WaterSupplyEntity[]> {
    const waterSupplies = await this.WaterSupplyRepo.find();
    return waterSupplies;
  }

  async findOne(id: string): Promise<WaterSupplyEntity> {
    const waterSupply = await this.WaterSupplyRepo.findOne({ where: { id } });
    if (!waterSupply) throw new NotFoundException('Water Supply not found');
    return waterSupply;
  }

  async update(id: string, payload: UpdateWaterSupplyDto): Promise<WaterSupplyEntity> {
    const waterSupply = await this.findOne(id);

    Object.assign(waterSupply, payload);

    if (payload.owner?.length) {
      const existingUsers = await this.userRepo.findBy({
        id: In(payload.owner),
      });

      const existingUserIds = existingUsers.map(user => user.id);
      const invalidUserIds = payload.owner.filter(id => !existingUserIds.includes(id));

      if (invalidUserIds.length > 0) {
        throw new NotFoundException(`UserNot Found: ${invalidUserIds.join(', ')}`);
      }

      waterSupply.owner = payload.owner;
    }


    return await this.WaterSupplyRepo.save(waterSupply);
  }

  async remove(id: string): Promise<void> {
    const result = await this.WaterSupplyRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Water Supply not found');
  }

}
