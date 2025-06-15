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
import { CreateWaterSupplyDto, UpdateWaterSupplyDto, WaterSupplyPageDto } from '../dto/waterSuplly.dto';
import { WaterSupplyEntity } from '../../database/typeorm/entities/water-supply';
import { PageDto } from '../../../common';
import { WaterSupplyEnum } from '../../../common/enums/water-supply.enum';

@Injectable()
export class WaterSupplyService {
  private readonly logger = new Logger(WaterSupplyService.name);

  constructor(
    private readonly WaterSupplyRepo: WaterSupplyRepository,
    private readonly userRepo: UserRepository,
    private readonly communeRepo: CommuneRepository,

  ) {}

   async create(payload: CreateWaterSupplyDto, userId: string): Promise<WaterSupplyEntity> {
    const commune = await this.communeRepo.findById(payload.communeId);
    if (!commune) {
      throw new NotFoundException(`Commune not found`);
    }
    
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
      commune: commune,
      createdBy: userId,
    });

    return waterSupply;

  }

  async findAll(payload: WaterSupplyPageDto): Promise<PageDto<WaterSupplyEntity>> {
    const { limit = 10, page = 1 } = payload;
    let [waterSupplies, total]: [WaterSupplyEntity[], number]= [[], 0];

    if (payload.orderField == 'commune') {
      [waterSupplies, total] = await this.WaterSupplyRepo.findAndCount({
        take: limit,
        skip: (page - 1) * limit,
        where: {
          commune: { id: payload.q },
        },
      });
    }else {
      [waterSupplies, total] = await this.WaterSupplyRepo.findAndCount({
        take: limit,
        skip: (page - 1) * limit,
        where: {
          [payload.orderField]: payload.q,
        }
      });
    }

    return new PageDto<WaterSupplyEntity>(waterSupplies, total);
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

  async updateByBiz(bizId: string, id: string, payload: UpdateWaterSupplyDto): Promise<WaterSupplyEntity> {
    const waterSupply = await this.WaterSupplyRepo.createQueryBuilder('waterSupply')
    .where('waterSupply.id = :id', { id })
    .andWhere(':bizId = ANY(waterSupply.owner)', { bizId })
    .getOne();

    if (!waterSupply) {
      throw new NotFoundException('Water Supply not found or you are not an owner');
    }

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

    }


    return await this.WaterSupplyRepo.save(waterSupply);
  }

  async remove(id: string): Promise<void> {
    const result = await this.WaterSupplyRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Water Supply not found');
  }

}
