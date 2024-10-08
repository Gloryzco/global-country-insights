import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from 'src/module/redis';
import { AxiosHelper, QueryBuilderService } from 'src/shared';
import AppError from 'src/shared/utils/AppError';
import configuration from 'src/config/configuration';
import { CountryService } from './countries.service';
import { HttpStatus } from '@nestjs/common';

const config = configuration();

export interface IAxiosHelperResponse {
  status: number;
  data: any;
}
// describe

describe('CountryService', () => {
  let countryService: CountryService;

  const mockRedisService = {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  };

  const mockQueryBuilderService = {
    clearCountries: jest.fn(),
    saveCountries: jest.fn(),
    findCountries: jest.fn(),
    findCountryByCode: jest.fn(),
    getRegionsWithPopulation: jest.fn(),
    getLanguagesWithDetails: jest.fn(),
    getTotalCountries: jest.fn(),
    getLargestCountryByArea: jest.fn(),
    getSmallestCountryByPopulation: jest.fn(),
    getMostWidelySpokenLanguage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountryService,
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: QueryBuilderService,
          useValue: mockQueryBuilderService,
        },
      ],
    }).compile();

    countryService = module.get<CountryService>(CountryService);
  });

  it('should be defined', () => {
    expect(countryService).toBeDefined();
  });

  describe('initializeCountries', () => {
    it('should initialize countries and save to Redis and DB', async () => {
      const apiCountries = [
        {
          name: {
            common: 'Country1',
            official: 'Country1 Official',
            nativeName: {},
          },
          cca2: 'C1',
          cca3: 'C01',
          region: 'Region1',
          subregion: 'Subregion1',
          languages: { en: 'English' },
          currencies: { USD: { name: 'US Dollar', symbol: '$' } },
          population: 1000000,
          capital: ['Capital1'],
          latlng: [1, 1],
          landlocked: false,
          borders: ['C2'],
          area: 1000,
          flags: { png: 'flag.png', svg: 'flag.svg' },
          coatOfArms: {},
        },
      ];

      const mappedCountries = [
        {
          commonName: 'Country1',
          officialName: 'Country1 Official',
          nativeName: JSON.stringify({}),
          cca2: 'C1',
          cca3: 'C01',
          region: 'Region1',
          subregion: 'Subregion1',
          languages: JSON.stringify({ en: 'English' }),
          currencies: JSON.stringify({
            USD: { name: 'US Dollar', symbol: '$' },
          }),
          population: 1000000,
          capital: ['Capital1'],
          latlng: [1, 1],
          landlocked: false,
          borderingCountries: ['C2'],
          area: 1000,
          flags: JSON.stringify({ png: 'flag.png', svg: 'flag.svg' }),
          coatOfArms: JSON.stringify({}),
        },
      ];

      const redisMappedCountries = [
        {
          commonName: 'Country1',
          officialName: 'Country1 Official',
          nativeName: {},
          cca2: 'C1',
          cca3: 'C01',
          region: 'Region1',
          subregion: 'Subregion1',
          languages: { en: 'English' },
          currencies: { USD: { name: 'US Dollar', symbol: '$' } },
          population: 1000000,
          capital: ['Capital1'],
          latlng: [1, 1],
          landlocked: false,
          borderingCountries: ['C2'],
          area: 1000,
          flags: { png: 'flag.png', svg: 'flag.svg' },
          coatOfArms: {},
        },
      ];

      jest.spyOn(AxiosHelper, 'sendGetRequest').mockResolvedValue({
        status: 200,
        data: apiCountries,
      });
      mockRedisService.delete.mockResolvedValue(undefined);
      mockRedisService.set.mockResolvedValue(undefined);
      mockQueryBuilderService.clearCountries.mockResolvedValue(undefined);
      mockQueryBuilderService.saveCountries.mockResolvedValue(undefined);

      const result = await countryService.initializeCountries();

      expect(AxiosHelper.sendGetRequest).toHaveBeenCalledWith(
        config.rest_country.base_url + 'all',
      );
      expect(mockRedisService.delete).toHaveBeenCalledWith('countries');
      expect(mockRedisService.set).toHaveBeenCalledWith(
        'countries',
        redisMappedCountries,
      );
      expect(mockQueryBuilderService.clearCountries).toHaveBeenCalled();
      expect(mockQueryBuilderService.saveCountries).toHaveBeenCalledWith(
        mappedCountries,
      );
      expect(result).toEqual(redisMappedCountries);
    });
  });

  describe('getCountries', () => {
    // it('should return countries from Redis cache', async () => {
    //   const queryDto = { region: 'Region1', page: 1, limit: 20 };
    //   const cachedCountries = [
    //     {
    //       commonName: 'Country1',
    //       officialName: 'Country1 Official',
    //       nativeName: {},
    //       cca2: 'C1',
    //       cca3: 'C01',
    //       region: 'Region1',
    //       subregion: 'Subregion1',
    //       languages: { en: 'English' },
    //       currencies: { USD: { name: 'US Dollar', symbol: '$' } },
    //       population: 1000000,
    //       capital: ['Capital1'],
    //       latlng: [1, 1],
    //       landlocked: false,
    //       borderingCountries: ['C2'],
    //       area: 1000,
    //       flags: { png: 'flag.png', svg: 'flag.svg' },
    //       coatOfArms: {},
    //     },
    //   ];
    
    //   mockRedisService.get.mockResolvedValue(cachedCountries);
    
    //   const result = await countryService.getCountries(queryDto);
    
    //   expect(mockRedisService.get).toHaveBeenCalledWith('countries', 'countries', {
    //     page: queryDto.page,
    //     limit: queryDto.limit,
    //   });
    //   expect(result).toEqual(cachedCountries);
    // });

    it('should query countries from the DB if not in Redis and cache the result', async () => {
      const queryDto = { region: 'Region1', page: 1, limit: 20 }; 
      const dbCountries = [
        {
          commonName: 'Country1',
          officialName: 'Country1 Official',
          nativeName: {},
          cca2: 'C1',
          cca3: 'C01',
          region: 'Region1',
          subregion: 'Subregion1',
          languages: { en: 'English' },
          currencies: { USD: { name: 'US Dollar', symbol: '$' } },
          population: 1000000,
          capital: ['Capital1'],
          latlng: [1, 1],
          landlocked: false,
          borderingCountries: ['C2'],
          area: 1000,
          flags: { png: 'flag.png', svg: 'flag.svg' },
          coatOfArms: {},
        },
      ];
    
      mockRedisService.get.mockResolvedValue(null);
      mockQueryBuilderService.findCountries.mockResolvedValue(dbCountries);
      mockRedisService.set.mockResolvedValue(undefined);
    
      const result = await countryService.getCountries(queryDto);
    
      expect(mockRedisService.get).toHaveBeenCalledWith('countries', 'countries', {
        page: queryDto.page,
        limit: queryDto.limit,
      });
      expect(mockQueryBuilderService.findCountries).toHaveBeenCalledWith(queryDto);
      expect(mockRedisService.set).toHaveBeenCalledWith('countries', dbCountries);
      expect(result).toEqual(dbCountries);
    });

    it('should throw an error if no countries are found', async () => {
      const queryDto = { region: 'UnknownRegion', page: 1, limit: 20 };
    
      mockRedisService.get.mockResolvedValue(null);
      mockQueryBuilderService.findCountries.mockResolvedValue([]);
    
      await expect(countryService.getCountries(queryDto)).rejects.toThrow(
        new AppError(
          '0001',
          'No countries found for the specified query',
          HttpStatus.NOT_FOUND,
        ),
      );
    });
    
  });

  describe('getCountryDetailbyCode', () => {
    it('should return country details from Redis cache', async () => {
      const codeDTO = { code: 'C1' };
      const cachedCountryDetail = {
        commonName: 'Country1',
        officialName: 'Country1 Official',
        nativeName: {},
        cca2: 'C1',
        cca3: 'C01',
        region: 'Region1',
        subregion: 'Subregion1',
        languages: { en: 'English' },
        currencies: { USD: { name: 'US Dollar', symbol: '$' } },
        population: 1000000,
        capital: ['Capital1'],
        latlng: [1, 1],
        landlocked: false,
        borderingCountries: ['C2'],
        area: 1000,
        flags: { png: 'flag.png', svg: 'flag.svg' },
        coatOfArms: {},
      };

      mockRedisService.get.mockResolvedValue(cachedCountryDetail);

      const result = await countryService.getCountryDetailbyCode(codeDTO);

      expect(mockRedisService.get).toHaveBeenCalledWith(
        `country:${codeDTO.code.toUpperCase()}`,
      );
      expect(result).toEqual(cachedCountryDetail);
    });

    it('should query country details from the DB if not in Redis and cache the result', async () => {
      const codeDTO = { code: 'C1' };
      const dbCountryDetail = {
        commonName: 'Country1',
        officialName: 'Country1 Official',
        nativeName: {},
        cca2: 'C1',
        cca3: 'C01',
        region: 'Region1',
        subregion: 'Subregion1',
        languages: { en: 'English' },
        currencies: { USD: { name: 'US Dollar', symbol: '$' } },
        population: 1000000,
        capital: ['Capital1'],
        latlng: [1, 1],
        landlocked: false,
        borderingCountries: ['C2'],
        area: 1000,
        flags: { png: 'flag.png', svg: 'flag.svg' },
        coatOfArms: {},
      };

      mockRedisService.get.mockResolvedValue(null);
      mockQueryBuilderService.findCountryByCode.mockResolvedValue(
        dbCountryDetail,
      );
      mockRedisService.set.mockResolvedValue(undefined);

      const result = await countryService.getCountryDetailbyCode(codeDTO);

      expect(mockRedisService.get).toHaveBeenCalledWith(
        `country:${codeDTO.code.toUpperCase()}`,
      );
      expect(mockQueryBuilderService.findCountryByCode).toHaveBeenCalledWith(
        codeDTO.code.toUpperCase(),
      );
      expect(mockRedisService.set).toHaveBeenCalledWith(
        `country:${codeDTO.code.toUpperCase()}`,
        dbCountryDetail,
      );
      expect(result).toEqual(dbCountryDetail);
    });

    it('should throw an error if the country detail is not found', async () => {
      const codeDTO = { code: 'UnknownCode' };

      mockRedisService.get.mockResolvedValue(null);
      mockQueryBuilderService.findCountryByCode.mockResolvedValue(null);

      await expect(
        countryService.getCountryDetailbyCode(codeDTO),
      ).rejects.toThrow(
        new AppError('0001', 'Country not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('getCountryStatistics', () => {
    it('should return statistics for countries', async () => {
      const stats = {
        totalCountries: 195,
        largestCountryByArea: { name: 'Russia', area: 17098242 },
        smallestCountryByPopulation: {
          name: 'Vatican City',
          population: 800,
        },
        mostWidelySpokenLanguage: { language: 'English', numberOfSpeakers: 50 },
      };
  
      mockQueryBuilderService.getTotalCountries.mockResolvedValue(stats.totalCountries);
      mockQueryBuilderService.getLargestCountryByArea.mockResolvedValue(stats.largestCountryByArea);
      mockQueryBuilderService.getSmallestCountryByPopulation.mockResolvedValue(stats.smallestCountryByPopulation);
      mockQueryBuilderService.getMostWidelySpokenLanguage.mockResolvedValue(stats.mostWidelySpokenLanguage);
  
      const result = await countryService.getCountryStatistics();
  
      expect(mockQueryBuilderService.getTotalCountries).toHaveBeenCalled();
      expect(mockQueryBuilderService.getLargestCountryByArea).toHaveBeenCalled();
      expect(mockQueryBuilderService.getSmallestCountryByPopulation).toHaveBeenCalled();
      expect(mockQueryBuilderService.getMostWidelySpokenLanguage).toHaveBeenCalled();
      expect(result).toEqual(stats);
    });
  });
  
});
