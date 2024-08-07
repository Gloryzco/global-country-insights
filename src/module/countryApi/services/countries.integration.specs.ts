import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from 'src/module/redis';
import { QueryBuilderService } from 'src/shared';
import { AxiosHelper } from 'src/shared';
import { CountryDto, QueryDTO, CodeDTO } from '../dtos';
import { CountryService } from './countries.service';
import { RegionDTO } from '../dtos/region.dto';

describe('CountryService Integration Tests', () => {
  let service: CountryService;
  let redisService: RedisService;
  let queryBuilder: QueryBuilderService;
  let axiosHelper: AxiosHelper;

  const mockCountries = [
    {
      cca3: 'USA',
      nameCommon: 'United States',
      nameOfficial: 'United States of America',
      nativeName: { eng: { official: 'United States of America', common: 'United States' } },
      tld: ['.us'],
      cca2: 'US',
      ccn3: '840',
      independent: true,
      status: 'officially assigned',
      unMember: true,
      currencies: { USD: { name: 'United States Dollar', symbol: '$' } },
      idd: { root: '+1', suffixes: [] },
      capital: ['Washington, D.C.'],
      altSpellings: ['US', 'USA', 'United States of America'],
      region: 'Americas',
      languages: { eng: 'English' },
      translations: { esp: { official: 'Estados Unidos de América', common: 'Estados Unidos' } },
      latlng: [38.0, -97.0],
      landlocked: false,
      area: 9372610,
      demonyms: { eng: { f: 'American', m: 'American' } },
      flag: 'https://restcountries.com/v3/flags/us.png',
      maps: { googleMaps: 'https://goo.gl/maps/xyz', openStreetMaps: 'https://www.openstreetmap.org/?mlat=38.0&mlon=-97.0' },
      population: 331002651,
      car: { signs: ['USA'], side: 'right' },
      timezones: ['UTC-05:00'],
      continents: ['North America'],
      flags: { png: 'https://restcountries.com/v3/flags/us.png', svg: 'https://restcountries.com/v3/flags/us.svg' },
      coatOfArms: { png: 'https://restcountries.com/v3/coatofarms/us.png', svg: 'https://restcountries.com/v3/coatofarms/us.svg' },
      startOfWeek: 'monday',
      capitalInfo: { latlng: [38.0, -97.0] }
    }
  ];

  const mockCountryDetail = {
    cca3: 'USA',
    nameCommon: 'United States',
    nameOfficial: 'United States of America',
    nativeName: { eng: { official: 'United States of America', common: 'United States' } },
    tld: ['.us'],
    cca2: 'US',
    ccn3: '840',
    independent: true,
    status: 'officially assigned',
    unMember: true,
    currencies: { USD: { name: 'United States Dollar', symbol: '$' } },
    idd: { root: '+1', suffixes: [] },
    capital: ['Washington, D.C.'],
    altSpellings: ['US', 'USA', 'United States of America'],
    region: 'Americas',
    languages: { eng: 'English' },
    translations: { esp: { official: 'Estados Unidos de América', common: 'Estados Unidos' } },
    latlng: [38.0, -97.0],
    landlocked: false,
    area: 9372610,
    demonyms: { eng: { f: 'American', m: 'American' } },
    flag: 'https://restcountries.com/v3/flags/us.png',
    maps: { googleMaps: 'https://goo.gl/maps/xyz', openStreetMaps: 'https://www.openstreetmap.org/?mlat=38.0&mlon=-97.0' },
    population: 331002651,
    car: { signs: ['USA'], side: 'right' },
    timezones: ['UTC-05:00'],
    continents: ['North America'],
    flags: { png: 'https://restcountries.com/v3/flags/us.png', svg: 'https://restcountries.com/v3/flags/us.svg' },
    coatOfArms: { png: 'https://restcountries.com/v3/coatofarms/us.png', svg: 'https://restcountries.com/v3/coatofarms/us.svg' },
    startOfWeek: 'monday',
    capitalInfo: { latlng: [38.0, -97.0] }
  };

  const mockRegionData = [
    {
      region: 'Asia',
      population: 4560000000
    },
    {
      region: 'Europe',
      population: 741000000
    }
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountryService,
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
        {
          provide: QueryBuilderService,
          useValue: {
            findCountries: jest.fn(),
            findCountryByCode: jest.fn(),
            findRegionsWithPopulation: jest.fn(),
            saveCountries: jest.fn(),
          },
        },
        {
          provide: AxiosHelper,
          useValue: {
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CountryService>(CountryService);
    redisService = module.get<RedisService>(RedisService);
    queryBuilder = module.get<QueryBuilderService>(QueryBuilderService);
    axiosHelper = module.get<AxiosHelper>(AxiosHelper);
  });

  describe('initializeCountries', () => {
    it('should initialize countries and save to Redis and database', async () => {
      const mockRedisResponse = JSON.stringify(mockCountries);

      // Mock Redis and AxiosHelper
      redisService.get = jest.fn().mockResolvedValue(null);
      AxiosHelper.sendPostRequest = jest.fn().mockResolvedValue({ data: mockCountries });
      redisService.set = jest.fn();
      queryBuilder.saveCountries = jest.fn();

      const result = await service.initializeCountries();

      expect(redisService.get).toHaveBeenCalledWith('countries');
      expect(AxiosHelper.sendPostRequest).toHaveBeenCalledWith('api/countries', {});
      expect(redisService.set).toHaveBeenCalledWith('countries', mockRedisResponse);
      expect(queryBuilder.saveCountries).toHaveBeenCalledWith(mockCountries);
      expect(result).toEqual(mockCountries);
    });

    it('should not reinitialize if countries are already in Redis', async () => {
      const mockRedisResponse = JSON.stringify(mockCountries);

      redisService.get = jest.fn().mockResolvedValue(mockRedisResponse);

      const result = await service.initializeCountries();

      expect(redisService.get).toHaveBeenCalledWith('countries');
      expect(AxiosHelper.sendPostRequest).not.toHaveBeenCalled();
      expect(queryBuilder.saveCountries).not.toHaveBeenCalled();
      expect(result).toEqual(mockCountries);
    });
  });

  describe('getCountries', () => {
    it('should retrieve countries with pagination', async () => {
      const queryDto: QueryDTO = { page: 1, limit: 10 };
      const mockRedisResponse = JSON.stringify(mockCountries);

      redisService.get = jest.fn().mockResolvedValue(mockRedisResponse);
      queryBuilder.findCountries = jest.fn().mockResolvedValue(mockCountries);

      const result = await service.getCountries(queryDto);

      expect(redisService.get).toHaveBeenCalledWith('countries');
      expect(queryBuilder.findCountries).not.toHaveBeenCalled();
      expect(result).toEqual(mockCountries);
    });

    it('should retrieve countries from the database if not found in Redis', async () => {
      const queryDto: QueryDTO = { page: 1, limit: 10 };
      const mockRedisResponse = JSON.stringify(mockCountries);

      redisService.get = jest.fn().mockResolvedValue(null);
      AxiosHelper.sendPostRequest = jest.fn().mockResolvedValue({ data: mockCountries });
      redisService.set = jest.fn();
      queryBuilder.findCountries = jest.fn().mockResolvedValue(mockCountries);

      const result = await service.getCountries(queryDto);

      expect(redisService.get).toHaveBeenCalledWith('countries');
      expect(queryBuilder.findCountries).toHaveBeenCalledWith(queryDto);
      expect(redisService.set).toHaveBeenCalledWith('countries', mockRedisResponse);
      expect(result).toEqual(mockCountries);
    });
  });

  describe('getCountryDetailbyCode', () => {
    it('should retrieve country details by code', async () => {
      const codeDTO: CodeDTO = { code: 'US' };
      const mockRedisResponse = JSON.stringify(mockCountryDetail);

      redisService.get = jest.fn().mockResolvedValue(mockRedisResponse);
      queryBuilder.findCountryByCode = jest.fn().mockResolvedValue(mockCountryDetail);

      const result = await service.getCountryDetailbyCode(codeDTO);

      expect(redisService.get).toHaveBeenCalledWith('country_US');
      expect(queryBuilder.findCountryByCode).not.toHaveBeenCalled();
      expect(result).toEqual(mockCountryDetail);
    });

    it('should retrieve country details from the database if not found in Redis', async () => {
      const codeDTO: CodeDTO = { code: 'US' };
      const mockRedisResponse = JSON.stringify(mockCountryDetail);

      redisService.get = jest.fn().mockResolvedValue(null);
      AxiosHelper.sendPostRequest = jest.fn().mockResolvedValue({ data: mockCountryDetail });
      redisService.set = jest.fn();
      queryBuilder.findCountryByCode = jest.fn().mockResolvedValue(mockCountryDetail);

      const result = await service.getCountryDetailbyCode(codeDTO);

      expect(redisService.get).toHaveBeenCalledWith('country_US');
      expect(queryBuilder.findCountryByCode).toHaveBeenCalledWith(codeDTO);
      expect(redisService.set).toHaveBeenCalledWith('country_US', mockRedisResponse);
      expect(result).toEqual(mockCountryDetail);
    });
  });

  describe('getRegionsWithPopulation', () => {
    it('should retrieve regions with population data', async () => {
      const regionDTO: RegionDTO = { regions: 'Asia, Europe' };
      const mockRedisResponse = JSON.stringify(mockRegionData);

      redisService.get = jest.fn().mockResolvedValue(mockRedisResponse);
      queryBuilder.getRegionsWithPopulation = jest.fn().mockResolvedValue(mockRegionData);

      const result = await service.getRegionsWithPopulation(regionDTO);

      expect(redisService.get).toHaveBeenCalledWith('regions_population');
      expect(queryBuilder.getRegionsWithPopulation).not.toHaveBeenCalled();
      expect(result).toEqual(mockRegionData);
    });

    it('should retrieve regions with population data from the database if not found in Redis', async () => {
      const regionDTO: RegionDTO = { regions: 'Asia, Europe' };
      const mockRedisResponse = JSON.stringify(mockRegionData);

      redisService.get = jest.fn().mockResolvedValue(null);
      AxiosHelper.sendPostRequest = jest.fn().mockResolvedValue({ data: mockRegionData });
      redisService.set = jest.fn();
      queryBuilder.getRegionsWithPopulation = jest.fn().mockResolvedValue(mockRegionData);

      const result = await service.getRegionsWithPopulation(regionDTO);

      expect(redisService.get).toHaveBeenCalledWith('regions_population');
      expect(queryBuilder.getRegionsWithPopulation).toHaveBeenCalledWith(regionDTO);
      expect(redisService.set).toHaveBeenCalledWith('regions_population', mockRedisResponse);
      expect(result).toEqual(mockRegionData);
    });
  });
});