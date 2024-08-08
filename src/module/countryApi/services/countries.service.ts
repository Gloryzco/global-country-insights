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
    const apiUrl = config.rest_country.base_url + 'all';
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

    await Promise.all([
      this.queryBuilder.clearCountries(),
      this.redisService.delete('countries'),
    ]);

    await Promise.all([
      this.queryBuilder.saveCountries(mappedCountries),
      this.redisService.set('countries', redisMappedCountries),
    ]);
    return redisMappedCountries;
  }

  async getCountries(queryDto: QueryDTO): Promise<any[]> {
    let { page, limit } = queryDto;
    page = page ? page : 1;
    limit = limit ? limit : 20;
    const offset = page - 1 * limit;
    const cacheKey = 'countries';

    let countries = await this.redisService.get(cacheKey, 'countries', {
      page: page,
      limit: limit,
    });

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
      .map((word) => word.trim())
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  }

  public filterCountriesByQuery(
    countries: ICountry[],
    queryDto: QueryDTO,
  ): {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    countries: ICountry[];
  } {
    const start = queryDto.page ? (queryDto.page - 1) * queryDto.limit : 0;
    const end = queryDto.limit ? start + queryDto.limit : -1;
    const queryRegions = queryDto.region
      ? this.toTitleCase(queryDto.region)
      : [];
    const filteredCountries = countries
    .filter((country) => {
      const countryRegion =
        country.region.charAt(0).toUpperCase() + country.region.slice(1);

      if (queryRegions.length > 0 && !queryRegions.includes(countryRegion))
        return false;
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
    });
    return {
      currentPage: queryDto.page ? queryDto.page : 1,
      totalPages: Math.ceil(
        filteredCountries.length / (queryDto.limit ? queryDto.limit : filteredCountries.length),
      ),
      totalRecords:filteredCountries.length,
      countries: filteredCountries
        .slice(start, end)
        .map((country) => {
          return {
            commonName: country.commonName,
            officialName: country.officialName,
            nativeName:
              typeof country.nativeName === 'string'
                ? JSON.parse(country.nativeName)
                : country.nativeName,
            cca2: country.cca2,
            cca3: country.cca3,
            region: country.region,
            subregion: country.subregion,
            languages:
              typeof country.languages === 'string'
                ? JSON.parse(country.languages)
                : country.languages,
            currencies:
              typeof country.currencies === 'string'
                ? JSON.parse(country.currencies)
                : country.currencies,
            population: country.population,
            capital: country.capital,
            latlng: country.latlng,
            landlocked: country.landlocked,
            borderingCountries: country.borderingCountries,
            area: country.area,
            flags:
              typeof country.flags === 'string'
                ? JSON.parse(country.flags)
                : country.flags,
            coatOfArms:
              typeof country.coatOfArms === 'string'
                ? JSON.parse(country.coatOfArms)
                : country.coatOfArms,
          };
        }),
    };
  }

  async getCountryDetailbyCode(codeDTO: CodeDTO): Promise<CountryDto> {
    const { code } = codeDTO;
    const cacheKey = `country:${code.toUpperCase()}`;

    let countryDetail = await this.redisService.get(cacheKey);

    if (countryDetail) {
      return countryDetail as CountryDto;
    }

    countryDetail = await this.queryBuilder.findCountryByCode(code);
    if (countryDetail) {
      countryDetail.nativeName =
        typeof countryDetail.nativeName === 'string'
          ? JSON.parse(countryDetail.nativeName)
          : countryDetail.nativeName;
      countryDetail.coatOfArms =
        typeof countryDetail.coatOfArms === 'string'
          ? JSON.parse(countryDetail.coatOfArms)
          : countryDetail.coatOfArms;
      countryDetail.flags =
        typeof countryDetail.flags === 'string'
          ? JSON.parse(countryDetail.flags)
          : countryDetail.flags;
      countryDetail.currencies =
        typeof countryDetail.currencies === 'string'
          ? JSON.parse(countryDetail.currencies)
          : countryDetail.currencies;
      countryDetail.languages =
        typeof countryDetail.languages === 'string'
          ? JSON.parse(countryDetail.languages)
          : countryDetail.languages;
      await this.redisService.set(cacheKey, countryDetail);
      return countryDetail;
    }

    throw new AppError('0001', 'Country not found', HttpStatus.NOT_FOUND);
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
        country.nativeName =
          typeof country.nativeName === 'string'
            ? JSON.parse(country.nativeName)
            : country.nativeName;

        country.coatOfArms =
          typeof country.coatOfArms === 'string'
            ? JSON.parse(country.coatOfArms)
            : country.coatOfArms;

        country.flags =
          typeof country.flags === 'string'
            ? JSON.parse(country.flags)
            : country.flags;

        country.currencies =
          typeof country.currencies === 'string'
            ? JSON.parse(country.currencies)
            : country.currencies;

        country.languages =
          typeof country.languages === 'string'
            ? JSON.parse(country.languages)
            : country.languages;
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

  async getCountryStatistics(): Promise<StatisticsDto> {
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

    await this.redisService.set(cacheKey, statisticsDto);

    return statisticsDto;
  }
}
