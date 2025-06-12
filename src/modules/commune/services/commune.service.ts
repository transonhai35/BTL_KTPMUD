import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CommuneRepository,
  DistrictRepository,
} from '@/modules/database';
import { CommuneDto, CreateCommuneDto, UpdateCommuneDto } from '../dto/commune.dto';


@Injectable()
export class CommuneService {
  private readonly logger = new Logger(CommuneService.name);

  constructor(
    private readonly districtRepo: DistrictRepository,
    private readonly communeRepo: CommuneRepository,
  ) {}

   async create(payload: CreateCommuneDto, userId: string): Promise<CommuneDto> {
    const district = await this.districtRepo.findOne({
        where: { id: payload.districtId },
      });
    if (!district) {
      throw new NotFoundException(`District not found`);
    }

    const commune = await this.communeRepo.store({
      ...payload,
      createdBy: userId,
      district: district,
    });

    return commune;
  }

  async findAll(): Promise<CommuneDto[]> {
    const communes = await this.communeRepo.find();
    return communes;
  }

  async findOne(id: string): Promise<CommuneDto> {
    const commune = await this.communeRepo.findOne({ where: { id } });
    if (!commune) throw new NotFoundException('Commune not found');
    return commune;
  }

  async update(id: string, payload: UpdateCommuneDto): Promise<CommuneDto> {
    const commune = await this.findOne(id);

    Object.assign(commune, payload);
    return await this.communeRepo.save(commune);
  }

  async remove(id: string): Promise<void> {
    const result = await this.communeRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Commune not found');
  }

}
