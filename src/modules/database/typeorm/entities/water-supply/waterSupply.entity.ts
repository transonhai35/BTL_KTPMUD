import { Column, Entity, ManyToOne} from 'typeorm';
import { WaterSupplyEnum } from '../../../../../common/enums/water-supply.enum';
import { BaseUuidEntity } from '../BaseUuidEntity';
import { CommuneEntity } from '../commune';

@Entity({name: 'water_supplies'})
export class WaterSupplyEntity extends BaseUuidEntity {
  @Column()
  name: string;

  @Column()
  location: string;

  @Column({ type: 'enum', enum: WaterSupplyEnum })
  type: WaterSupplyEnum;

  @Column({ nullable: true })
  capacity: number;

  @Column()
  status: string;

  @Column({ nullable: true })
  constructionYear: number;

  @Column({ nullable: true })
  constructionMonth: number;

  @Column({ nullable: true })
  householdCount: number;

  @ManyToOne(() => CommuneEntity, (commune) => commune.waterSupplies, { onDelete: 'CASCADE' })
  commune: CommuneEntity;

  @Column({ nullable: true })
  communeId: string;

  @Column({ type: 'json', nullable: true })
  meta: Record<string, any>;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'text', array: true, nullable: true })
  owner: string[];

  @Column({ nullable: true })
  createdBy: string;
}