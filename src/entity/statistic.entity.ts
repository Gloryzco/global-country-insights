import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Country } from './country.entity';

@Entity('statistics')
export class Statistics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  totalCountries: number;

  @OneToOne(() => Country)
  @JoinColumn({ name: 'largestCountryByAreaId' })
  largestCountryByArea: Country;

  @OneToOne(() => Country)
  @JoinColumn({ name: 'smallestCountryByPopulationId' })
  smallestCountryByPopulation: Country;

  @Column({ type: 'varchar', length: 255 })
  mostWidelySpokenLanguage: string;
}
