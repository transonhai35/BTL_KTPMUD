import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { PlanType } from '../../../../../common/enums/plan-type';
import { WaterPlanStatus } from '../../../../../common/enums/water-plan-status.enum';
import { BaseUuidEntity } from '../BaseUuidEntity';
import { DistrictEntity } from '../district';
import { CommuneEntity } from '../commune';
import { WaterAccessIndicatorEntity } from '../water-access-indicator/waterAccessIndicator.entity';

@Entity({name: 'water_sanitation_plans'})
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

  @Column({ nullable: true })
  communeId: string;

  @OneToMany(() => WaterAccessIndicatorEntity, (indicator) => indicator.waterSanitationPlan, { onDelete: 'CASCADE' })
  waterAccessIndicators: WaterAccessIndicatorEntity[];

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