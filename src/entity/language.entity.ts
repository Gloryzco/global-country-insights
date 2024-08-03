import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Country } from './country.entity'; 

@Entity('languages')
export class Language {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @ManyToMany(() => Country, country => country.languages)
  @JoinTable()
  countries: Country[];

  @Column({ type: 'int' })
  totalSpeakers: number;
}
