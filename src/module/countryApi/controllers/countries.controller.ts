import {
  Controller,
  Response,
  UseGuards,
  Get,
  Query,
  Param,
  HttpStatus,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResponseFormat, withPaginatedResponse } from 'src/shared';
import { AccessTokenGuard } from 'src/shared/guards';
import {
  CodeDTO,
  CountryDto,
  CountryResponseDto,
  LanguageDetail,
  QueryDTO,
  RegionResponseDto,
  StatisticsDto,
} from '../dtos';
import { CountryService } from '../services';
import { RegionDTO } from '../dtos/region.dto';

@ApiBearerAuth('JWT')
@UseGuards(AccessTokenGuard)
@ApiTags('Countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countryService: CountryService) {}

  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiOperation({
    summary:
      'Retrieve a list of countries with pagination and optional filtering by region or population size',
  })
  @ApiOkResponse({
    description: 'Successful',
    type: CountryResponseDto,
  })
  @Get()
  async getCountries(
    @Query() queryDto: QueryDTO,
    @Response() res,
  ): Promise<ResponseFormat> {
    const countries: CountryDto[] =
      await this.countryService.getCountries(queryDto);
    return ResponseFormat.successResponse(
      res,
      countries,
      'Countries fetched Successfully',
      HttpStatus.OK,
    );
  }

  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiOkResponse({
    description: 'Successful',
    type: [RegionResponseDto],
  })
  @ApiOperation({
    summary:
      'Retrieve a list of regions and the countries within each region, with additional aggregated data such as the total population of the region.',
  })
  @Get('regions')
  async getRegionsWithCountries(
    @Query() regionDTO: RegionDTO,
    @Response() res,
  ) {
    const regionsData =
      await this.countryService.getRegionsWithPopulation(regionDTO);

    return ResponseFormat.successResponse(
      res,
      regionsData,
      'Regions fetched Successfully',
      HttpStatus.OK,
    );
  }

  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiOkResponse({
    description: 'Successful',
    type: [LanguageDetail],
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiOperation({
    summary:
      'Retrieve a list of languages with details including the countries they are spoken in and the total number of speakers globally.',
  })
  @Get('languages')
  async getLanguages(@Response() res) {
    const languagesData = await this.countryService.getLanguagesWithDetails();
    return ResponseFormat.successResponse(
      res,
      languagesData,
      'Countries languages fetched Successfully',
      HttpStatus.OK,
    );
  }

  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiOkResponse({
    description: 'Successful',
    type: StatisticsDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiOperation({
    summary:
      'Retrieve aggregated statistics including total number of countries, largest country by area, smallest country by population, and most widely spoken language.',
  })
  @Get('statistics')
  async getCountryStatistics(@Response() res) {
    const statisticsData = await this.countryService.getCountryStatistics();
    return ResponseFormat.successResponse(
      res,
      statisticsData,
      'Countries statistics fetched Successfully',
      HttpStatus.OK,
    );
  }

  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiOkResponse({
    description: 'Successful',
    type: withPaginatedResponse(CountryResponseDto, true),
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiOperation({
    summary:
      'Retrieve detailed information for a specific country, including its languages, population, area, and bordering countries.',
  })
  @Get(':code')
  async getCountryDetail(
    @Query() code: CodeDTO,
    @Response() res,
  ): Promise<ResponseFormat> {
    const countryDetail =
      await this.countryService.getCountryDetailbyCode(code);
    return ResponseFormat.successResponse(
      res,
      countryDetail,
      'Country details fetched Successfully',
      HttpStatus.OK,
    );
  }
}
