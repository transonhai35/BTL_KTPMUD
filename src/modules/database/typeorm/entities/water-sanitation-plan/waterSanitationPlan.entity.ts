import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { PlanType } from '../../../../../common/enums/plan-type';
import { WaterPlanStatus } from '../../../../../common/enums/water-plan-status.enum';
import { BaseUuidEntity } from '../BaseUuidEntity';
import { DistrictEntity } from '../district';
import { CommuneEntity } from '../commune';

@Entity()
export class WaterSanitationPlanEntity extends BaseUuidEntity {
  @Column()
  title: string;

  @Column({nullable: true})
  location: string;

  @Column()
  planType: PlanType;

  @Column()
  status: WaterPlanStatus; 

  @ManyToOne(() => CommuneEntity, (commune) => commune.waterSanitationPlans, { onDelete: 'CASCADE' })
  commune: CommuneEntity;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'text', array: true, nullable: true })
  assign: string[];

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  attachedFiles: object; // Store file metadata

  @Column({ nullable: true })
  createdBy: string;
}