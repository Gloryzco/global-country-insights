import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  commonName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  officialName: string;

  @Column({ type: 'json', nullable: true })
  nativeName: Record<string, { official: string; common: string }>;

  @Column({ type: 'varchar', length: 2, nullable: true })
  cca2: string;

  @Column({ type: 'varchar', length: 3, nullable: true })
  cca3: string;

  @Column({ type: 'int', nullable: true })
  population: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  region: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subregion: string;

  @Column({ type: 'json', nullable: true })
  languages: Record<string, string>;

  @Column({ type: 'json', nullable: true })
  currencies: { name: string; symbol: string };

  @Column({ type: 'simple-array', nullable: true })
  capital: string[];

  @Column({ type: 'simple-array', nullable: true })
  latlng: [number, number];

  @Column({ type: 'boolean', nullable: true })
  landlocked: boolean;

  @Column({ type: 'simple-array', nullable: true })
  borderingCountries: string[];

  @Column({ type: 'float', nullable: true })
  area: number;

  @Column({ type: 'json', nullable: true })
  flags: { png: string; svg: string; alt: string };

  @Column({ type: 'json', nullable: true })
  coatOfArms: { png: string; svg: string };
}
