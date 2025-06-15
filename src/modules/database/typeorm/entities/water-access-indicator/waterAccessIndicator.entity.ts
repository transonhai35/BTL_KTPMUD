import { Column, Entity, ManyToOne} from 'typeorm';
import { WaterSupplyEnum } from '../../../../../common/enums/water-supply.enum';
import { BaseUuidEntity } from '../BaseUuidEntity';
import { CommuneEntity } from '../commune';
import { WaterSanitationPlanEntity } from '../water-sanitation-plan';

@Entity({name: 'water_access_indicator'})
export class WaterAccessIndicatorEntity extends BaseUuidEntity {
  @Column({ type: 'float' })
  accessRate: number; //The ratio of households to use clean water

  @Column()
  numberOfFacilities: number;

  @Column({ nullable: true })
  waterQualityIndex: number;

  @ManyToOne(() => WaterSanitationPlanEntity, (val) => val.waterAccessIndicators, { onDelete: 'CASCADE' })
  waterSanitationPlan: WaterSanitationPlanEntity;

  @Column({ nullable: true })
  waterSanitationPlanId: string;

  @Column({ type: 'json', nullable: true })
  meta: Record<string, any>;

  @Column({ nullable: true })
  createdBy: string;
}