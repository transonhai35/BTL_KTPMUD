import { BeforeInsert, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseUuidEntity } from '../BaseUuidEntity';
import randomize from 'randomatic';
import { DistrictEntity } from '../district';


@Entity({ name: 'communes' })
export class CommuneEntity extends BaseUuidEntity {
  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @ManyToOne(() => DistrictEntity, (district) => district.communes, { onDelete: 'CASCADE' })
  district: DistrictEntity;

  @Column({ nullable: true })
  createdBy: string;

  @BeforeInsert()
    private setCode() {
      this.code = randomize('0A', 9);
    }
  
}
