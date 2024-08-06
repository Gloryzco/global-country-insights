import { HttpStatus, Injectable } from '@nestjs/common';
import { codeDTO, CountryDto, LanguageDetail, QueryDTO, RegionResponseDto, StatisticsDto } from '../dtos';
import { RedisService } from 'src/module/redis';
import { AxiosHelper, QueryBuilderService } from 'src/shared';
import configuration from 'src/config/configuration';
import { ICountry } from '../interfaces';
import AppError from 'src/shared/utils/AppError';
import { RegionDTO } from '../dtos/region.dto';

const config = configuration();

@Injectable()
export class CountryService {
  constructor(
    private readonly redisService: RedisService,
    private readonly queryBuilder: QueryBuilderService,
  ) {}

  async initializeCountries(): Promise<void> {
    const apiUrl = 'https://restcountries.com/v3.1/all';
    const response = await AxiosHelper.sendGetRequest(apiUrl);
    const apiCountries = response.data;

    const mappedCountries = apiCountries.map((apiCountry: any) => ({
      commonName: apiCountry.name?.common,
      officialName: apiCountry.name?.official,
      nativeName: JSON.stringify(apiCountry.name?.nativeName),
      cca2: apiCountry.cca2,
      cca3: apiCountry.cca3,
      region: apiCountry.region,
      subregion: apiCountry.subregion,
      languages: JSON.stringify(apiCountry.languages),
      currencies: JSON.stringify(apiCountry.currencies),
      population: apiCountry.population,
      capital: apiCountry.capital,
      latlng: apiCountry.latlng,
      landlocked: apiCountry.landlocked,
      borderingCountries: apiCountry.borders,
      area: apiCountry.area,
      flags: JSON.stringify(apiCountry.flags),
      coatOfArms: JSON.stringify(apiCountry.coatOfArms),
    }));

    // Clear existing data
    await Promise.all([
      this.queryBuilder.clearCountries(),
      this.redisService.delete('countries'),
    ]);

    // Save new data
    await Promise.all([
      this.queryBuilder.saveCountries(mappedCountries),
      this.redisService.set('countries', mappedCountries),
    ]);
    return mappedCountries;
  }

  async getCountries(queryDto: QueryDTO): Promise<any[]> {
    const cacheKey = 'countries';

    let countries = await this.redisService.get(cacheKey);

    if (countries) {
      countries = this.filterCountriesByQuery(countries, queryDto);
      return countries;
    }

    countries = await this.queryBuilder.findCountries(queryDto);

    if (countries.length > 0) {
      await this.redisService.set(cacheKey, countries);
      return countries;
    }

    await this.initializeCountries();
    countries = await this.redisService.get(cacheKey);

    return this.filterCountriesByQuery(countries, queryDto);
  }

  private filterCountriesByQuery(
    countries: ICountry[],
    queryDto: QueryDTO,
  ): any[] {
    return countries
      .filter((country) => {
        if (queryDto.region && country.region !== queryDto.region) return false;
        if (
          queryDto.minPopulation &&
          country.population < queryDto.minPopulation
        )
          return false;
        if (
          queryDto.maxPopulation &&
          country.population > queryDto.maxPopulation
        )
          return false;
        return true;
      })
      .map((country) => ({
        commonName: country.commonName,
        officialName: country.officialName,
        nativeName: JSON.parse(country.nativeName as unknown as string),
        cca2: country.cca2,
        cca3: country.cca3,
        region: country.region,
        subregion: country.subregion,
        languages: JSON.parse(country.languages as unknown as string),
        currencies: JSON.parse(country.currencies as unknown as string),
        population: country.population,
        capital: country.capital,
        latlng: country.latlng,
        landlocked: country.landlocked,
        borderingCountries: country.borderingCountries,
        area: country.area,
        flags: JSON.parse(country.flags as unknown as string),
        coatOfArms: JSON.parse(country.coatOfArms as unknown as string),
      }));
  }

  async getCountryDetail(codeDTO: codeDTO): Promise<CountryDto> {
    const { code } = codeDTO;
    const cacheKey = 'countries';

    let countries = await this.redisService.get(cacheKey);
    try {
      if (countries) {
        const countryDetail = countries.find(
          (country) => country.cca3 === code.toUpperCase(),
        );

        if (countryDetail) {
          return countryDetail;
        }
      }

      let countryDetail = await this.queryBuilder.findCountryByCode(code);

      if (countryDetail) {
        countries = countries || [];
        countries.push(countryDetail);
        await this.redisService.set(cacheKey, countries);
        return countryDetail;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getRegionsWithPopulation(regionDTO: RegionDTO): Promise<RegionResponseDto[]> {
    try {
      const regionsArray = regionDTO.regions
      ? regionDTO.regions.split(',').map(region => region.trim())
      : [];

    const aggregatedRegions = await this.queryBuilder.getRegionsWithPopulation(regionsArray);

    const regionDtos: RegionResponseDto[] = aggregatedRegions.map(region => ({
      name: region.name,
      countries: region.countries,
      totalPopulation: Number(region.totalPopulation),
    }));

    return regionDtos;
    } catch (error) {
      console.error('Error getting regions with population:', error);
      throw new Error('Failed to get regions with population');
    }
  }

  async getLanguagesWithDetails(): Promise<LanguageDetail[]> {
    const cacheKey = 'languages';

    let languages = await this.redisService.get(cacheKey);

    if (!languages) {
      languages = await this.queryBuilder.getLanguagesWithDetails();
      await this.redisService.set(cacheKey, languages);
    }

    return languages;
  }

  async getStatistics(): Promise<StatisticsDto> {
    try {
      const totalCountries = await this.queryBuilder.getTotalCountries();
      const largestCountry = await this.queryBuilder.getLargestCountryByArea();
      const smallestCountry = await this.queryBuilder.getSmallestCountryByPopulation();
      const mostWidelySpokenLanguage = await this.queryBuilder.getMostWidelySpokenLanguage();

      return {
        totalCountries,
        largestCountryByArea: {
          name: largestCountry.name,
          area: largestCountry.area,
        },
        smallestCountryByPopulation: {
          name: smallestCountry.name,
          population: smallestCountry.population,
        },
        mostWidelySpokenLanguage: {
          language: mostWidelySpokenLanguage.language,
          numberOfSpeakers: mostWidelySpokenLanguage.numberOfSpeakers,
        },
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      throw new Error('Failed to get statistics');
    }
  }
  
}
