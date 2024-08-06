import { Controller, HttpStatus, Post, Response } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CountryResponseDto, CountryService } from 'src/module/countryApi';
import { ResponseFormat, withPaginatedResponse } from 'src/shared';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly countryService: CountryService) {}

  @ApiCreatedResponse({
    description: 'Successful',
    type: withPaginatedResponse(CountryResponseDto, true),
  })
  @ApiOperation({
    summary: 'Retrieve all countries from the API, store them persistently in the database, and cache them in Redis for future requests',
  })
  @Post('initialize-countries')
  async initializeCountries(@Response() res): Promise<ResponseFormat> {
    const countries = await this.countryService.initializeCountries();
    return ResponseFormat.successResponse(
      res,
      countries,
      'Countries Persisted Successfully',
      HttpStatus.OK,
    );
  }
}
