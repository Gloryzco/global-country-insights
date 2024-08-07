import { Test, TestingModule } from '@nestjs/testing';
import { CountriesController } from './countries.controller';
import { CountryService } from '../services';
import { QueryDTO, CodeDTO } from '../dtos';
import { ResponseFormat } from 'src/shared';
import { ExecutionContext, HttpStatus } from '@nestjs/common';
import { RegionDTO } from '../dtos/region.dto';
import { AccessTokenGuard } from 'src/shared/guards';

describe('CountriesController', () => {
  let countriesController: CountriesController;
  let countryService: CountryService;

  const mockCountryService = {
    getCountries: jest.fn(),
    getRegionsWithPopulation: jest.fn(),
    getLanguagesWithDetails: jest.fn(),
    getCountryStatistics: jest.fn(),
    getCountryDetailbyCode: jest.fn(),
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  const mockUserId = 'userId';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountriesController],
      providers: [
        {
          provide: CountryService,
          useValue: mockCountryService,
        },
      ],
    })
      .overrideGuard(AccessTokenGuard)
      .useValue({
        canActivate: jest.fn((context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user['sub'] = mockUserId;
          return true;
        }),
      })
      .compile();

    countriesController = module.get<CountriesController>(CountriesController);
    countryService = module.get<CountryService>(CountryService);
  });

  it('should be defined', () => {
    expect(countriesController).toBeDefined();
  });

  describe('getCountries', () => {
    it('should fetch countries and return success response', async () => {
      const queryDto: QueryDTO = { region: 'Europe', minPopulation: 1000000 };
      const countries = [{ name: 'France', population: 67000000 }];

      mockCountryService.getCountries.mockResolvedValue(countries);
      const responseSpy = jest.spyOn(ResponseFormat, 'successResponse');

      await countriesController.getCountries(queryDto, mockResponse);

      expect(countryService.getCountries).toHaveBeenCalledWith(queryDto);
      expect(responseSpy).toHaveBeenCalledWith(
        mockResponse,
        countries,
        'Countries fetched Successfully',
        HttpStatus.OK,
      );
    });
  });

  describe('getRegionsWithCountries', () => {
    it('should fetch regions with countries and return success response', async () => {
      const regionDTO: RegionDTO = { regions: 'Europe' };
      const regionsData = [{ region: 'Europe', totalPopulation: 500000000 }];

      mockCountryService.getRegionsWithPopulation.mockResolvedValue(
        regionsData,
      );
      const responseSpy = jest.spyOn(ResponseFormat, 'successResponse');

      await countriesController.getRegionsWithCountries(
        regionDTO,
        mockResponse,
      );

      expect(countryService.getRegionsWithPopulation).toHaveBeenCalledWith(
        regionDTO,
      );
      expect(responseSpy).toHaveBeenCalledWith(
        mockResponse,
        regionsData,
        'Regions fetched Successfully',
        HttpStatus.OK,
      );
    });
  });

  describe('getLanguages', () => {
    it('should fetch languages with details and return success response', async () => {
      const languagesData = [
        { language: 'English', countries: ['USA', 'UK'], speakers: 1500000000 },
      ];

      mockCountryService.getLanguagesWithDetails.mockResolvedValue(
        languagesData,
      );
      const responseSpy = jest.spyOn(ResponseFormat, 'successResponse');

      await countriesController.getLanguages(mockResponse);

      expect(countryService.getLanguagesWithDetails).toHaveBeenCalled();
      expect(responseSpy).toHaveBeenCalledWith(
        mockResponse,
        languagesData,
        'Country details fetched Successfully',
        HttpStatus.OK,
      );
    });
  });

  describe('getCountryStatistics', () => {
    it('should fetch statistics and return success response', async () => {
      const statisticsData = {
        totalCountries: 195,
        largestCountry: 'Russia',
        smallestCountry: 'Vatican City',
        mostSpokenLanguage: 'English',
      };

      mockCountryService.getCountryStatistics.mockResolvedValue(statisticsData);
      const responseSpy = jest.spyOn(ResponseFormat, 'successResponse');

      await countriesController.getCountryStatistics(mockResponse);

      expect(countryService.getCountryStatistics).toHaveBeenCalled();
      expect(responseSpy).toHaveBeenCalledWith(
        mockResponse,
        statisticsData,
        'Country details fetched Successfully',
        HttpStatus.OK,
      );
    });
  });

  describe('getCountryDetail', () => {
    it('should fetch country detail by code and return success response', async () => {
      const codeDto: CodeDTO = { code: 'US' };
      const countryDetail = {
        code: 'US',
        name: 'United States',
        population: 331000000,
      };

      mockCountryService.getCountryDetailbyCode.mockResolvedValue(
        countryDetail,
      );
      const responseSpy = jest.spyOn(ResponseFormat, 'successResponse');

      await countriesController.getCountryDetail(codeDto, mockResponse);

      expect(countryService.getCountryDetailbyCode).toHaveBeenCalledWith(
        codeDto,
      );
      expect(responseSpy).toHaveBeenCalledWith(
        mockResponse,
        countryDetail,
        'Country details fetched Successfully',
        HttpStatus.OK,
      );
    });
  });
});
