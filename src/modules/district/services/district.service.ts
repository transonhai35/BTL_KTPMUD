import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CommuneRepository,
  DistrictRepository,
} from '@/modules/database';
import { CreateDistrictDto, DistrictDto, UpdateDistrictDto } from '../dto/district.dto';


@Injectable()
export class DistrictService {
  private readonly logger = new Logger(DistrictService.name);

  constructor(
    private readonly districtRepo: DistrictRepository,
    private readonly communeRepo: CommuneRepository,
  ) {}

   async create(payload: CreateDistrictDto, userId: string): Promise<DistrictDto> {
    const district = await this.districtRepo.store({
      ...payload,
      createdBy: userId,
    });

    return district;
  }

  async findAll(): Promise<DistrictDto[]> {
    const districts = await this.districtRepo.find();
    return districts;
  }

  async findOne(id: string): Promise<DistrictDto> {
    const district = await this.districtRepo.findOne({ where: { id } });
    if (!district) throw new NotFoundException('District not found');
    return district;
  }

  async update(id: string, payload: UpdateDistrictDto): Promise<DistrictDto> {
    const district = await this.findOne(id);

    Object.assign(district, payload);
    return await this.districtRepo.save(district);
  }

  async remove(id: string): Promise<void> {
    const result = await this.districtRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('District not found');
  }
  
}
