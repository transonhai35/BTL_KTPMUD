import { Column, Entity} from 'typeorm';
import { WaterSupplyEnum } from '../../../../../common/enums/water-supply.enum';
import { BaseUuidEntity } from '../BaseUuidEntity';

@Entity()
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
  householdCount: number;

  @Column({ type: 'json', nullable: true })
  meta: Record<string, any>;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'text', array: true, nullable: true })
  owner: string[];
}