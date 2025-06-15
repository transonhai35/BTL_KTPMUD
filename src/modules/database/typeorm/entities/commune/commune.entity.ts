import { BeforeInsert, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseUuidEntity } from '../BaseUuidEntity';
import randomize from 'randomatic';
import { DistrictEntity } from '../district';
import { WaterSanitationPlanEntity } from '../water-sanitation-plan';
import { WaterSupplyEntity } from '../water-supply';


@Entity({ name: 'communes' })
export class CommuneEntity extends BaseUuidEntity {
  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @ManyToOne(() => DistrictEntity, (district) => district.communes, { onDelete: 'CASCADE' })
  district: DistrictEntity;

  @Column({ nullable: true })
  districtId: string;

  @OneToMany(() => WaterSanitationPlanEntity, (waterSanitationPlan) => waterSanitationPlan.commune)
  waterSanitationPlans: WaterSanitationPlanEntity[];

  @OneToMany(() => WaterSupplyEntity, (waterSupply) => waterSupply.commune)
  waterSupplies: WaterSupplyEntity[];

  @Column({ nullable: true })
  createdBy: string;

  @BeforeInsert()
    private setCode() {
      this.code = randomize('0A', 9);
    }
  
}
