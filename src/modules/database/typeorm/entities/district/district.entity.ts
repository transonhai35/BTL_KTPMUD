import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { BaseUuidEntity } from '../BaseUuidEntity';
import randomize from 'randomatic';
import { CommuneEntity } from '../commune/commune.entity';


@Entity({ name: 'districts' })
export class DistrictEntity extends BaseUuidEntity {
  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @OneToMany(() => CommuneEntity, (commune) => commune.district, {
    cascade: true,
    eager: true,
  })
  communes: CommuneEntity[];

  @Column({ nullable: true })
  createdBy: string;

  @BeforeInsert()
    private setCode() {
      this.code = randomize('0A', 9);
    }
  
}