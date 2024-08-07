import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { CountryService } from 'src/module/countryApi';
import { ResponseFormat } from 'src/shared';
import { HttpStatus } from '@nestjs/common';
import { AccessTokenGuard } from 'src/shared/guards';

describe('AdminController', () => {
  let adminController: AdminController;
  let countryService: CountryService;

  const mockCountryService = {
    initializeCountries: jest.fn(),
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: CountryService,
          useValue: mockCountryService,
        },
      ],
    })
    .overrideGuard(AccessTokenGuard) 
    .useValue({
      canActivate: jest.fn(() => true), 
    })
    .compile();

    adminController = module.get<AdminController>(AdminController);
    countryService = module.get<CountryService>(CountryService);
  });

  it('should be defined', () => {
    expect(adminController).toBeDefined();
  });

  describe('initializeCountries', () => {
    it('should initialize countries and return success response', async () => {
      const countries = [
        { id: '1', name: 'Nigeria' },
        { id: '2', name: 'USA' },
      ];

      mockCountryService.initializeCountries.mockResolvedValue(countries);

      const responseSpy = jest.spyOn(ResponseFormat, 'successResponse');

      await adminController.initializeCountries(mockResponse);

      expect(countryService.initializeCountries).toHaveBeenCalled();
      expect(responseSpy).toHaveBeenCalledWith(
        mockResponse,
        countries,
        'Countries fetched Successfully',
        HttpStatus.OK,
      );
    });
  });
});
