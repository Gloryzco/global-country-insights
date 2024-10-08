import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from 'src/entity';
import {
  CountryDto,
  LanguageDetail,
  QueryDTO,
  RegionResponseDto,
} from 'src/module';
import AppError from '../utils/AppError';

@Injectable()
export class QueryBuilderService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async findCountryByCode(code: string): Promise<Country | null> {
    try {
      return await this.countryRepository.findOne({
        where: { cca3: code },
      });
    } catch (error) {
      console.error(`Error finding country by code ${code}:`, error);
      throw new Error('Failed to find country by code');
    }
  }

  async findCountryById(id: number): Promise<Country | null> {
    try {
      return await this.countryRepository.findOne({
        where: { id },
      });
    } catch (error) {
      console.error(`Error finding country by ID ${id}:`, error);
      throw new Error('Failed to find country by ID');
    }
  }

  async findCountries(queryDto: QueryDTO): Promise<Country[]> {
    try {
      const queryBuilder = this.countryRepository.createQueryBuilder('country');

      if (queryDto.region) {
        queryBuilder.andWhere('LOWER(country.region) = :region', {
          region: queryDto.region.toLowerCase(),
        });
      }

      if (queryDto.minPopulation) {
        queryBuilder.andWhere('country.population >= :minPopulation', {
          minPopulation: queryDto.minPopulation,
        });
      }

      if (queryDto.maxPopulation) {
        queryBuilder.andWhere('country.population <= :maxPopulation', {
          maxPopulation: queryDto.maxPopulation,
        });
      }

      const page = queryDto.page || 1;
      const limit = queryDto.limit || 10;
      queryBuilder.skip((page - 1) * limit);
      queryBuilder.take(limit);
      const [countries, totalRecords] = await queryBuilder.getManyAndCount();
      const totalPages = Math.ceil(totalRecords / limit);

      return countries;
    } catch (error) {
      console.error('Error finding countries:', error);
      throw new Error('Failed to find countries');
    }
  }

  async saveCountries(countries: CountryDto[]): Promise<void> {
    try {
      for (const country of countries) {
        const newCountry = new Country();

        newCountry.commonName = country.commonName;
        newCountry.officialName = country.officialName;
        newCountry.nativeName = country.nativeName;
        newCountry.cca2 = country.cca2;
        newCountry.cca3 = country.cca3;
        newCountry.population = country.population;
        newCountry.region = country.region;
        newCountry.subregion = country.subregion;
        newCountry.languages = country.languages;
        newCountry.currencies = country.currencies;
        newCountry.capital = country.capital;
        newCountry.latlng = country.latlng;
        newCountry.landlocked = country.landlocked;
        newCountry.borderingCountries = country.borderingCountries;
        newCountry.area = country.area;
        newCountry.flags = country.flags;
        newCountry.coatOfArms = country.coatOfArms;

        await this.countryRepository.save(newCountry);
      }
    } catch (error) {
      console.error('Error saving countries:', error);
      throw new Error('Failed to save countries');
    }
  }

  async getRegionsWithPopulation(
    regions: string[] = [],
  ): Promise<RegionResponseDto[]> {
    try {
      const aggregatedRegions = await this.countryRepository
        .createQueryBuilder('country')
        .select('country.region', 'region')
        .addSelect('SUM(country.population)', 'totalPopulation')
        .groupBy('country.region')
        .where(regions.length > 0 ? 'country.region IN (:...regions)' : '1=1', {
          regions,
        })
        .getRawMany();

      const regionDtos: RegionResponseDto[] = await Promise.all(
        aggregatedRegions.map(async (region) => {
          const countries = await this.countryRepository
            .createQueryBuilder('country')
            .where('country.region = :region', { region: region.region })
            .getMany();

          return {
            name: region.region,
            countries,
            totalPopulation: Number(region.totalPopulation),
          };
        }),
      );

      return regionDtos;
    } catch (error) {
      console.error('Error getting regions with population:', error);
      throw new Error('Failed to get regions with population');
    }
  }

  async getLanguagesWithDetails(): Promise<any> {
    try {

      const languagesData: {
        [key: string]: { countries: string[]; totalSpeakers: number };
      } = {};

      const countriesData = await this.countryRepository
        .createQueryBuilder('country')
        .select(`JSON_UNQUOTE(country.languages)`, 'language')
        .addSelect('country.population', 'totalSpeakers')
        .addSelect('country.commonName', 'country')
        .getRawMany();

      countriesData.forEach((data) => {
        const languages = JSON.parse(data.language);

        if (languages) {
          Object.entries(languages).forEach(([key, value]) => {
            if (!languagesData[languages[key]]) {
              languagesData[languages[key]] = {
                countries: [data.country],
                totalSpeakers: Number(data.totalSpeakers),
              };
            } else {
              languagesData[languages[key]].countries.push(data.country);
              languagesData[languages[key]].totalSpeakers += Number(
                data.totalSpeakers,
              );
            }
          });
        }
      });

      const result = Object.keys(languagesData).map((key) => ({
        language: key,
        countries: languagesData[key].countries,
        totalSpeakers: languagesData[key].totalSpeakers,
      }));
      return result;
    } catch (error) {
      console.error('Error getting languages with details:', error);
      throw new Error('Failed to get languages with details');
    }
  }

  async getTotalCountries(): Promise<number> {
    try {
      return await this.countryRepository.count();
    } catch (error) {
      console.error('Error getting total countries:', error);
      throw new Error('Failed to get total countries');
    }
  }

  async getLargestCountryByArea(): Promise<{ name: string; area: number }> {
    try {
      const country = await this.countryRepository
        .createQueryBuilder('country')
        .select('country.commonName')
        .addSelect('country.area')
        .orderBy('country.area', 'DESC')
        .limit(1)
        .getRawOne();
      if (country) {
        return { name: country.country_commonName, area: country.country_area };
      }

      throw new Error(`Could not find`);
    } catch (error) {
      console.error('Error getting largest country by area:', error);
      throw new AppError('0001', 'Failed to get largest country by area');
    }
  }

  async getSmallestCountryByPopulation(): Promise<{
    name: string;
    population: number;
  }> {
    try {
      const country = await this.countryRepository
        .createQueryBuilder('country')
        .select('country.commonName', 'name')
        .addSelect('country.population', 'population')
        .orderBy('country.population', 'ASC')
        .limit(1)
        .getRawOne();

      return { name: country.name, population: country.population };
    } catch (error) {
      console.error('Error getting smallest country by population:', error);
      throw new Error('Failed to get smallest country by population');
    }
  }

  async getMostWidelySpokenLanguage(): Promise<{
    language: string;
    numberOfSpeakers: number;
  }> {
    try {
      const languageData = await this.countryRepository
        .createQueryBuilder('country')
        .select('JSON_UNQUOTE(country.languages)', 'language')
        .addSelect('SUM(population)', 'totalSpeakers')
        .groupBy('language')
        .orderBy('totalSpeakers', 'DESC')
        .limit(1)
        .getRawOne();
      const languageKeys = Object.keys(JSON.parse(languageData.language)).at(0)
      return {
        language: JSON.parse(languageData.language)[languageKeys],
        numberOfSpeakers: Number(languageData.totalSpeakers),
      };
    } catch (error) {
      console.error('Error getting most widely spoken language:', error);
      throw new Error('Failed to get most widely spoken language');
    }
  }

  async clearCountries(): Promise<void> {
    await this.countryRepository.clear();
  }
}
