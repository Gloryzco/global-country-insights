import { HttpStatus, Injectable } from '@nestjs/common';
import {
  CodeDTO,
  CountryDto,
  LanguageDetail,
  QueryDTO,
  RegionResponseDto,
  StatisticsDto,
} from '../dtos';
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

    const redisMappedCountries = apiCountries.map((apiCountry: any) => ({
      commonName: apiCountry.name?.common,
      officialName: apiCountry.name?.official,
      nativeName: apiCountry.name?.nativeName,
      cca2: apiCountry.cca2,
      cca3: apiCountry.cca3,
      region: apiCountry.region,
      subregion: apiCountry.subregion,
      languages: apiCountry.languages,
      currencies: apiCountry.currencies,
      population: apiCountry.population,
      capital: apiCountry.capital,
      latlng: apiCountry.latlng,
      landlocked: apiCountry.landlocked,
      borderingCountries: apiCountry.borders,
      area: apiCountry.area,
      flags: apiCountry.flags,
      coatOfArms: apiCountry.coatOfArms,
    }));

    // Clear existing data
    await Promise.all([
      this.queryBuilder.clearCountries(),
      this.redisService.delete('countries'),
    ]);

    // Save new data
    await Promise.all([
      this.queryBuilder.saveCountries(mappedCountries),
      this.redisService.set('countries', redisMappedCountries),
    ]);
    return redisMappedCountries;
  }

  async getCountries(queryDto: QueryDTO): Promise<any[]> {
    const cacheKey = 'countries';

    let countries = await this.redisService.get(cacheKey);

    if (countries) {
      countries = this.filterCountriesByQuery(countries, queryDto);
      if (countries.length === 0) {
        throw new AppError(
          '0001',
          'No countries found for the specified query',
          HttpStatus.NOT_FOUND,
        );
      }
      return countries;
    }

    countries = await this.queryBuilder.findCountries(queryDto);

    if (countries.length > 0) {
      await this.redisService.set(cacheKey, countries);
      return countries;
    }

    throw new AppError(
      '0001',
      'No countries found for the specified query',
      HttpStatus.NOT_FOUND,
    );
  }

  private toTitleCase(str: string): string[] {
    return str
      .toLowerCase()
      .split(',')
      .map((word) => {
        word = word.trim();
        word = word.charAt(0).toUpperCase() + word.slice(1);
        return word;
      });
  }

  private filterCountriesByQuery(
    countries: ICountry[],
    queryDto: QueryDTO,
  ): any[] {
    return countries
      .filter((country) => {
        const countryRegion = this.toTitleCase(queryDto.region);

        if (!countryRegion.includes(country.region)) return false;
        console.log(countryRegion);
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

  async getCountryDetailbyCode(codeDTO: CodeDTO): Promise<CountryDto> {
    const { code } = codeDTO;
    const cacheKey = `country:${code.toUpperCase()}`;

    let countryDetail = await this.redisService.get(cacheKey);

    if (countryDetail) {
      return countryDetail as CountryDto;
    }

    countryDetail = await this.queryBuilder.findCountryByCode(code);
    countryDetail.nativeName = JSON.parse(
      countryDetail.nativeName as unknown as string,
    );
    countryDetail.coatOfArms = JSON.parse(
      countryDetail.coatOfArms as unknown as string,
    );
    countryDetail.flags = JSON.parse(countryDetail.flags as unknown as string);
    countryDetail.currencies = JSON.parse(
      countryDetail.currencies as unknown as string,
    );
    countryDetail.languages = JSON.parse(countryDetail.languages as unknown as string);
    

    if (countryDetail) {
      await this.redisService.set(cacheKey, countryDetail);
      return countryDetail;
    }

    throw new AppError('0001', 'Country not found');
  }

  async getRegionsWithPopulation(
    regionDTO: RegionDTO,
  ): Promise<RegionResponseDto[]> {
    const regionsArray = regionDTO.regions
      ? regionDTO.regions.split(',').map((region) => region.trim())
      : [];

    const cacheKey = `regionsPopulation:${regionsArray.join(',')}`;

    let cachedData = await this.redisService.get(cacheKey);
    if (cachedData) {
      return cachedData as RegionResponseDto[];
    }

    const aggregatedRegions =
      await this.queryBuilder.getRegionsWithPopulation(regionsArray);

    if (aggregatedRegions.length === 0) {
      throw new AppError(
        '0001',
        'No regions found for the specified query',
        HttpStatus.NOT_FOUND,
      );
    }

    const regionDtos: RegionResponseDto[] = aggregatedRegions.map((region) => {
      region.countries.map((country) => {
        country.nativeName = JSON.parse(
          country.nativeName as unknown as string,
        );
        country.coatOfArms = JSON.parse(
          country.coatOfArms as unknown as string,
        );
        country.flags = JSON.parse(country.flags as unknown as string);
        country.currencies = JSON.parse(
          country.currencies as unknown as string,
        );
        country.languages = JSON.parse(country.languages as unknown as string);
      });
      return {
        name: region.name,
        countries: region.countries,
        totalPopulation: Number(region.totalPopulation),
      };
    });

    await this.redisService.set(cacheKey, regionDtos);

    return regionDtos;
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
    const cacheKey = 'statistics';

    let statistics = await this.redisService.get(cacheKey);

    if (statistics) {
      return statistics;
    }

    const totalCountries = await this.queryBuilder.getTotalCountries();
    const largestCountry = await this.queryBuilder.getLargestCountryByArea();
    const smallestCountry =
      await this.queryBuilder.getSmallestCountryByPopulation();
    const mostWidelySpokenLanguage =
      await this.queryBuilder.getMostWidelySpokenLanguage();

    const statisticsDto: StatisticsDto = {
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

    await this.redisService.set(cacheKey, JSON.stringify(statisticsDto));

    return statisticsDto;
  }
}
