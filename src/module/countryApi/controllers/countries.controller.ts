import { Controller, Response, UseGuards, Get, Query } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseFormat, TaskResponseDto } from 'src/shared';
import { AccessTokenGuard } from 'src/shared/guards';
import { CountryDto, CountryListResponseDto, QueryDTO } from '../dtos';

@ApiBearerAuth('JWT')
@UseGuards(AccessTokenGuard)
@ApiTags('Country')
@Controller('country')
export class CountriesController {
  //   constructor(private readonly countriesService: CountriesService) {}

  @ApiOperation({ summary: 'Retrieve a list of countries with pagination and optional filtering by region or population size' })
  @ApiOkResponse({
    description: 'Successfully fetched countries',
    type: TaskResponseDto,
  })
  @Get()
  async getCountries(
    @Query() queryDto: QueryDTO,
    @Response() res,
  ): Promise<ResponseFormat> {
    // const countries: CountryDto = await this.countriesService.fetchCountries(queryDto);
    return ResponseFormat.successResponse(
      res,
      'countries',
      'Countries fetched Successfully',
      201,
    );
  }
}
