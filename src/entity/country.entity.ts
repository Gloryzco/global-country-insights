import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 3, unique: true })
  cca3: string;

  @Column({ type: 'varchar', length: 255 })
  nameCommon: string;

  @Column({ type: 'varchar', length: 255 })
  nameOfficial: string;

  @Column('json')
  nativeName: Record<string, { official?: string; common?: string }>;

  @Column('simple-array')
  tld: string[];

  @Column({ type: 'varchar', length: 2 })
  cca2: string;

  @Column({ type: 'varchar', length: 3 })
  ccn3: string;

  @Column({ type: 'boolean' })
  independent: boolean;

  @Column({ type: 'varchar', length: 255 })
  status: string;

  @Column({ type: 'boolean' })
  unMember: boolean;

  @Column('json')
  currencies: Record<string, { name: string; symbol: string }>;

  @Column('json')
  idd: { root: string; suffixes: string[] };

  @Column('simple-array')
  capital: string[];

  @Column('simple-array')
  altSpellings: string[];

  @Column({ type: 'varchar', length: 255 })
  region: string;

  @Column('json')
  languages: Record<string, string>;

  @Column('json')
  translations: Record<string, { official: string; common: string }>;

  @Column('point')
  latlng: [number, number];

  @Column({ type: 'boolean' })
  landlocked: boolean;

  @Column({ type: 'float' })
  area: number;

  @Column('json')
  demonyms: Record<string, { f: string; m: string }>;

  @Column({ type: 'varchar', length: 255 })
  flag: string;

  @Column('json')
  maps: { googleMaps: string; openStreetMaps: string };

  @Column({ type: 'int' })
  population: number;

  @Column('json')
  car: { signs: string[]; side: string };

  @Column('simple-array')
  timezones: string[];

  @Column('simple-array')
  continents: string[];

  @Column('json')
  flags: { png: string; svg: string };

  @Column('json', { nullable: true })
  coatOfArms?: Record<string, any>;

  @Column({ type: 'varchar', length: 255 })
  startOfWeek: string;

  @Column('json')
  capitalInfo: { latlng: [number, number] };
}
